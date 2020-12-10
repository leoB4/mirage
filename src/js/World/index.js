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
    this.models = options.models
    this.textures = options.textures

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
    this.modelsLoaded = false
    this.texturesLoaded = false

    this.loadDiv = document.createElement('div')
    this.loadDiv.classList.add('loadScreen')
    document.body.append(this.loadDiv)

    this.loadModels = document.createElement('h1')
    this.loadModels.innerHTML = 'Loading models...'
    this.loadModels.classList.add('load')
    this.loadDiv.append(this.loadModels)

    this.loadTextures = document.createElement('h1')
    this.loadTextures.innerHTML = 'Loading textures...'
    this.loadTextures.classList.add('load')
    this.loadDiv.append(this.loadTextures)

    this.enter = document.createElement('button')
    this.enter.innerHTML = '...'
    this.enter.classList.add('start')
    this.loadDiv.append(this.enter)

    if(this.models.modelsReady){
      this.modelsLoaded = true
      this.loadModels.innerHTML = 'Models ok'
      this.checkLoad()
    } else {
      this.models.on('modelsReady', () => {
        this.modelsLoaded = true
        this.loadModels.innerHTML = 'Models ok'
        this.checkLoad()
      })
    }

    if (this.textures.texturesReady) {
      this.texturesLoaded = true
      this.loadTextures.innerHTML = 'Textures ok'
      this.checkLoad()
    } else {
      this.textures.on('texturesReady', () => {
        this.texturesLoaded = true
        this.loadTextures.innerHTML = 'Textures ok'
        this.checkLoad()
      })
    }
  }
  checkLoad() {
    if (this.modelsLoaded === this.texturesLoaded === true) {
      this.enter.innerHTML = 'Start'

      this.enter.addEventListener('click', () => {
        this.init()
        this.loadDiv.style.opacity = 0
        setTimeout(() => {
          this.loadDiv.remove()
        }, 320)
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
      models: this.models.src,
    })
    this.container.add(this.suzanne.container)
  }
  setDune() {
    this.dunes = new Dune({
      time: this.time,
      models: this.models.src,
    })
    this.container.add(this.dunes.container)
  }
  setCerceau() {
    this.cerceau = new Cerceau({
      debug: this.debugFolder,
      models: this.models.src,
      time: this.time,
    })
    this.container.add(this.cerceau.container)
  }
  setWall() {
    this.wall = new Plan()
    this.container.add(this.wall.container)
  }
}
