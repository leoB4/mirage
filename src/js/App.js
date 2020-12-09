import { Fog, PCFSoftShadowMap, Scene, WebGLRenderer, Clock } from 'three'
import {EffectComposer, BloomEffect, EffectPass, RenderPass, GodRaysEffect} from 'postprocessing'
import * as dat from 'dat.gui'

import Sizes from '@tools/Sizes.js'
import Time from '@tools/Time.js'
import Models from '@tools/ModelLoader.js'
import Textures from '@tools/TextureLoader.js'

import Camera from './Camera.js'
import World from '@world/index.js'

export default class App {
  constructor(options) {
    // Set options
    this.canvas = options.canvas

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.models = new Models()
    this.textures = new Textures()

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setComposer()
    this.setBloom()
    this.setWorld()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    this.scene.fog = new Fog(0x000000,0.025,60)
    // Set renderer
    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      canvas: this.canvas,
      alpha: true,
      antialias: false,
      stencil: false,
      depth: false,
    })

    console.log(this.renderer);
    
    // Set background color
    this.renderer.setClearColor(0x212121, 1)
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
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    // Set RequestAnimationFrame with 60ips
    console.log(this.composer);
    this.time.on('tick', () => {
      this.renderer.render(this.scene, this.camera.camera)
      this.composer.render(this.time.delta) 

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
      models: this.models,
      textures: this.textures,
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

  setComposer() {
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera.camera))
  }

  setBloom() {
    this.bloomEffect = new BloomEffect({
      intensity: 1,
      luminanceThreshold: 0.25,
    })
    this.bloomEffect.blurPass.scale = 5
    this.composer.addPass(new EffectPass(this.camera.camera, this.bloomEffect))
  }

  setGodRay() {
    console.log(this.scene);
    this.composer.addPass(new EffectPass(this.camera.camera, new GodRaysEffect(this.camera.camera, this.world.container.parent.children[1].children[1])))
  }
}
