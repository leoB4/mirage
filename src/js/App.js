import { Fog, PCFSoftShadowMap, Scene, WebGLRenderer, Clock, FogExp2, ShaderMaterial, Layers, MeshBasicMaterial, Vector2, AudioListener } from 'three'
import { EffectComposer } from '../postprocessing/EffectComposer.js';
import { RenderPass } from '../postprocessing/RenderPass.js';
import { ShaderPass } from '../postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '../postprocessing/UnrealBloomPass.js';
import vertexShader from '@shaders/vertexShader.vert'
import fragmentShader from '@shaders/fragmentShader.frag'

import * as dat from 'dat.gui'

import Sizes from '@tools/Sizes.js'
import Time from '@tools/Time.js'
import Loader from '@tools/Loader.js'

import Camera from './Camera.js'
import World from '@world/index.js'

const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

export default class App {
  constructor(options) {
    // Set options
    this.canvas = options.canvas

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Loader()

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setAudioListener()
    this.setWorld()
    this.setBloom()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    this.scene.fog = new FogExp2(0x998162,0.0062)

    // Bloom layers
    this.bloomLayer = new Layers();
    this.bloomLayer.set( BLOOM_SCENE )

    // Materials
    this.darkMaterial = new MeshBasicMaterial( { color: "black", fog: false } );
		this.materials = {}

    // Set renderer
    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      canvas: this.canvas,
      antialias: true,
    })

    // Set background color
    this.renderer.setClearColor(0x998162, 1)
    // Set renderer pixel ratio & sizes
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    // Resize renderer on resize event
    this.sizes.on('resize', () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      )
    })
    this.renderer.shadowMap.type = PCFSoftShadowMap

    // Set RequestAnimationFrame with 60ips
    this.time.on('tick', () => {
      if (this.bloomComposer && this.finalComposer) {
        this.renderer.setClearColor(0x000000, 1)
        this.scene.traverse( this.darkenNonBloomed.bind(this) )
        this.bloomComposer.render()
        this.renderer.setClearColor(0x998162, 1)
        this.scene.traverse( this.restoreMaterial.bind(this) )
        this.finalComposer.render()
      }
    })
  }
  setCamera() {
    // Create camera instance
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
    })
    // Add camera to scene
    this.scene.add(this.camera.container)
  }
  setWorld() {
    // Create world instance
    this.world = new World({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      models: this.assets.models,
      textures: this.assets.textures,
      BLOOM_SCENE
    })
    // Add world to scene
    this.scene.add(this.world.container)
    // this.setGodRay()
  }
  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 420 })
    }
  }

  setBloom() {
    this.renderScene = new RenderPass( this.scene, this.camera.camera )
    this.bloomComposer = new EffectComposer( this.renderer )
		this.bloomComposer.renderToScreen = false

    this.bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    this.bloomPass.threshold = 0
    this.bloomPass.strength = 4
    this.bloomPass.radius = 0.8
    this.bloomPass.exposure = 1

    this.bloomComposer.addPass( this.renderScene )
    this.bloomComposer.addPass( this.bloomPass )

    this.finalPass = new ShaderPass(
      new ShaderMaterial( {
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        defines: {}
      } ), "baseTexture"
    );
    this.finalPass.needsSwap = true;

    this.finalComposer = new EffectComposer( this.renderer )
    this.finalComposer.addPass( this.renderScene )
    this.finalComposer.addPass( this.finalPass )
  }

  darkenNonBloomed( obj ) {
    if ( obj.isMesh && this.bloomLayer.test( obj.layers ) === false ) {
      this.materials[ obj.uuid ] = obj.material;
      obj.material = this.darkMaterial;
    }
  }

  restoreMaterial( obj ) {
    if ( this.materials[ obj.uuid ] ) {
      obj.material = this.materials[ obj.uuid ];
      delete this.materials[ obj.uuid ];
    }
  }
  setAudioListener() {
    this.listener = new AudioListener();
    this.camera.camera.add( this.listener );
  }
}
