import { Object3D, AudioListener } from 'three'
import Halo from './Halo/Halo'
import City from './City/City'
import Forest from './Forest/Forest.js'

export default class World {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets
    this.BLOOM_SCENE = options.BLOOM_SCENE
    this.DECAL_SCENE = options.DECAL_SCENE
    this.scene = options.scene
    this.jsLaunch = options.jsLaunch
    this.camera = options.camera

    this.container = new Object3D()

    this.setLoader()
  }

  init() {
    this.setAudioListener()
    this.setForest()
    this.setCity()
    this.setHalo()
  }

  setLoader() {
    this.loadDiv = document.querySelector('.loadScreen')
    this.loadModels = this.loadDiv.querySelector('.load')
    this.progress = this.loadDiv.querySelector('.progress')
    this.homeDiv = document.querySelector('.home')
    this.mirage = document.querySelector('.mirage')
    this.festival = document.querySelector('.festival')
    this.year = document.querySelector('.year')
    this.homeInfo = document.querySelector('.home-info')
    this.body = document.querySelector('body')

    if (this.assets.total === 0) {
      this.init()
      this.loadDiv.remove()
    } else {
      this.assets.on('ressourceLoad', () => {
        this.progress.style.width = `${
          Math.floor((this.assets.done / this.assets.total) * 100) +
          Math.floor((1 / this.assets.total) * this.assets.currentPercent)
        }%`
      })

      this.assets.on('ressourcesReady', () => {
        this.loadDiv.style.opacity = 0
        setTimeout(() => {
          this.loadDiv.remove()
        }, 550)
        this.homeDiv.style.opacity = 1
        this.mirage.style.opacity = 1
        this.mirage.style.transform = "rotate(0deg) translateY(0)"
        this.festival.style.opacity = 1
        this.festival.style.transform = "rotate(0deg) translateY(0)"
        this.year.style.opacity = 1
        this.year.style.transform = "rotate(0deg) translateY(0)"
        this.homeInfo.style.opacity = 1
        this.homeInfo.style.transform = "rotate(0deg) translateY(0)"
        this.jsLaunch.style.opacity = 1
        this.jsLaunch.addEventListener('click', ()=>{
          this.init()
          setTimeout(() => {
            this.homeDiv.style.opacity = 0
            setTimeout(()=>{
              this.homeDiv.remove()
              this.body.classList.toggle('onLoading')
            }, 550)
          }, 550)
        })
      })
    }
  }

  setAudioListener() {
    this.listener = new AudioListener()
    this.camera.add(this.listener)
  }

  setForest() {
    this.forest = new Forest({
      time: this.time,
      assets: this.assets,
      listener: this.listener,
      BLOOM_SCENE: this.BLOOM_SCENE,
      scene: this.scene
    })
    this.container.add(this.forest.container)
  }

  setCity() {
    this.city = new City({
      time: this.time,
      assets: this.assets,
      listener: this.listener
    })
    this.city.container.position.set(this.DECAL_SCENE,0,0)
    this.city.container.visible = false
    this.container.add(this.city.container)
  }

  setHalo() {
    this.halo = new Halo({
      time: this.time,
      assets: this.assets,
      BLOOM_SCENE: this.BLOOM_SCENE,
      listener: this.listener
    })
    this.halo.container.position.set(this.DECAL_SCENE*2,0,0)
    this.halo.container.visible = false
    this.container.add(this.halo.container)
  }
}
