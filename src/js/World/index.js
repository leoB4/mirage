import { Object3D } from 'three'

import AmbientLightSource from './AmbientLight.js'
import Cerceau from './cerceau.js'
import PointLightSource from './PointLight.js'
import Suzanne from './Suzanne.js'
import Dune from './Dune.js'
import Plan from './Plan'
import SpotDune from './spotDune.js'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets

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
    // this.setPointLight()
    this.setCerceau()
    this.setDune()
    this.setSpotDune()
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

  setAmbientLight() {
    this.light = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
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
  setPointLight() {
    this.light = new PointLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }
  setSuzanne() {
    this.suzanne = new Suzanne({
      time: this.time,
      assets: this.assets.src,
    })
    this.container.add(this.suzanne.container)
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
    })
    this.container.add(this.cerceau.container)
  }
  setWall() {
    this.wall = new Plan()
    this.container.add(this.wall.container)
  }
}
