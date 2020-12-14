import { Object3D } from 'three'

import Cerceau from './Cerceau.js'
import Dune from './Dune.js'
import SpotDune from './SpotDune'

export default class Halo {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.BLOOM_SCENE = options.BLOOM_SCENE
    this.listener = options.listener

    // Set up
    this.container = new Object3D()

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Halo')
      this.debugFolder.open()
    }
    this.createHalo()

  }
  createHalo() {
    this.setCerceau()
    this.setDune()
    this.setSpotDune()
  }
  
  setSpotDune() {
    this.spotDune = new SpotDune({
      debug: this.debugFolder,
      position: {x:150,y:50,z:100},
      intensity: 1.5,
      distanceSpot: 2000,
      angleSpot: 0.50
    })
    this.container.add(this.spotDune.container)
  }
  setDune() {
    this.dunes = new Dune({
      time: this.time,
      models: this.assets.models,
    })
    this.container.add(this.dunes.container)
  }
  setCerceau() {
    this.cerceau = new Cerceau({
      debug: this.debugFolder,
      models: this.assets.models,
      time: this.time,
      BLOOM_SCENE: this.BLOOM_SCENE,
      listener: this.listener,
    })
    this.container.add(this.cerceau.container)
  }
}
