import { Object3D } from 'three'
import AmbientLightSource from '@world/AmbientLight'
import Cerceau from './Cerceau.js'
import Dune from './Dune.js'

export default class Halo {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets
    this.BLOOM_SCENE = options.BLOOM_SCENE
    this.listener = options.listener

    this.container = new Object3D()
    this.container.name = "halo"

    this.createHalo()
  }

  createHalo() {
    this.setCerceau()
    this.setDune()
    this.setAmbientLight()
  }

  setAmbientLight() {
    this.light = new AmbientLightSource({
      color: 0x9c9c9c
    })
    this.container.add(this.light.container)
  }

  setDune() {
    this.dunes = new Dune({
      time: this.time,
      models: this.assets.models,
      listener: this.listener,
    })
    this.container.add(this.dunes.container)
  }

  setCerceau() {
    this.cerceau = new Cerceau({
      models: this.assets.models,
      time: this.time,
      BLOOM_SCENE: this.BLOOM_SCENE,
      listener: this.listener,
    })
    this.container.add(this.cerceau.container)
  }
}
