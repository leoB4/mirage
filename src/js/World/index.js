import { Object3D } from 'three'

import AmbientLightSource from './AmbientLight.js'
import Plan from './Plan'
import Halo from './Halo/Halo'
import City from './City/City'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.BLOOM_SCENE = options.BLOOM_SCENE
    this.DECAL_SCENE = options.DECAL_SCENE
    this.listener = options.listener

    // Set up
    this.container = new Object3D()

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('World')
      this.debugFolder.open()
    }

    this.setLoader()
  }
  init() {
    this.setAmbientLight()
    this.setHalo()
    this.setCity()
  }
  setLoader() {
    this.loadDiv = document.querySelector('.loadScreen')
    this.loadModels = this.loadDiv.querySelector('.load')
    this.progress = this.loadDiv.querySelector('.progress')

    if (this.assets.total === 0) {
      this.init()
      this.loadDiv.remove()
    } else {
      this.assets.on('ressourceLoad', () => {
        this.progress.style.width = this.loadModels.innerHTML = `${
          Math.floor((this.assets.done / this.assets.total) * 100) +
          Math.floor((1 / this.assets.total) * this.assets.currentPercent)
        }%`
      })

      this.assets.on('ressourcesReady', () => {
        this.init()

          this.loadDiv.style.opacity = 0
          setTimeout(() => {
            this.loadDiv.remove()
          }, 550)
      })
    }
  }
  setHalo() {
    this.halo = new Halo({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      BLOOM_SCENE: this.BLOOM_SCENE,
      listener: this.listener
    })
    this.halo.container.position.set(this.DECAL_SCENE,0,0)
    this.container.add(this.halo.container)
  }

  setAmbientLight() {
    this.light = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }
  setCity() {
    this.city = new City({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      listener: this.listener
    })
    this.container.add(this.city.container)
  }
  setWall() {
    this.wall = new Plan()
    this.container.add(this.wall.container)
  }
}
