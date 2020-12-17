import { Object3D, AudioListener } from 'three'
import Plan from './Plan'
import Halo from './Halo/Halo'
import City from './City/City'
import Forest from './Forest/Forest.js'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.assets = options.assets
    this.BLOOM_SCENE = options.BLOOM_SCENE
    this.DECAL_SCENE = options.DECAL_SCENE
    this.scene = options.scene
    this.jsLaunch = options.jsLaunch
    this.camera = options.camera

    // Set up
    this.container = new Object3D()

    this.setLoader()
  }
  init() {
    this.setAudioListener()
    this.setForest()
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
        console.log(this.jsLaunch);
        this.jsLaunch.addEventListener('click', ()=>{
          this.init()
          this.loadDiv.style.opacity = 0
          setTimeout(() => {
            this.loadDiv.remove()
          }, 550)
        })

      })
    }
  }
  setAudioListener() {
    this.listener = new AudioListener();
    this.camera.add(this.listener)
  }

  setHalo() {
    this.halo = new Halo({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      BLOOM_SCENE: this.BLOOM_SCENE,
      listener: this.listener
    })
    this.halo.container.position.set(this.DECAL_SCENE*2,0,0)
    // this.halo.container.visible = false
    this.container.add(this.halo.container)
  }

  setCity() {
    this.city = new City({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      listener: this.listener
    })
    this.city.container.position.set(this.DECAL_SCENE,0,0)
    // this.city.container.visible = false
    this.container.add(this.city.container)
  }

  setForest() {
    this.forest = new Forest({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      listener: this.listener,
      BLOOM_SCENE: this.BLOOM_SCENE,
      scene: this.scene
    })
    this.container.add(this.forest.container)
  }
  setWall() {
    this.wall = new Plan()
    this.container.add(this.wall.container)
  }
}
