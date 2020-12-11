import { Fog, PCFSoftShadowMap, Scene, WebGLRenderer, Clock, FogExp2 } from 'three'
import {EffectComposer, BloomEffect, EffectPass, RenderPass, GodRaysEffect, KernelSize} from 'postprocessing'
import * as dat from 'dat.gui'

import Sizes from '@tools/Sizes.js'
import Time from '@tools/Time.js'
import Loader from '@tools/Loader.js'

import Camera from './Camera.js'
import World from '@world/index.js'

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
    this.setComposer()
    this.setWorld()
    this.setBloom()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    this.scene.fog = new FogExp2(0x998162,0.0062)
    // Set renderer
    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      canvas: this.canvas,
      alpha: true,
      antialias: false,
      stencil: false,
      depth: false,
    })

    // Set background color
    this.renderer.setClearColor(0x505050, 1)
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
      this.camera.camera.layers.set(1)
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
      assets: this.assets,
      models: this.assets.models,
      textures: this.assets.textures,
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
      intensity: 10,
      luminanceThreshold: 0.2,
      luminanceSmoothing: 0.9,
    })
    this.bloomEffect.blurPass.kernelSize = KernelSize.VERY_LARGE
    
    this.assets.on('ressourcesReady', () => {
      this.bloomEffect.selection = this.world.container.children[1].children[0]
      console.log(this.bloomEffect.selection);
      this.composer.addPass(new EffectPass(this.camera.camera, this.bloomEffect))
    })
    // this.bloomEffect.ignoreBackground = true
  }

  setGodRay() {
    this.composer.addPass(new EffectPass(this.camera.camera, new GodRaysEffect(this.camera.camera, this.world.container.parent.children[1].children[1])))
  }
}
