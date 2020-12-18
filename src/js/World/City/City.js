import { Object3D } from 'three'
import AmbientLightSource from '@world/AmbientLight'
import ModelCity from './ModelCity.js'
import SpotLightCity from './SpotLightCity'
import MovingSpot from'./MovingSpot'

export default class City {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets
    this.listener = options.listener

    this.container = new Object3D()
    this.container.name = "city"

    this.createCity()
  }
  createCity() {
    this.setCity()
    this.setSpotLightCity()
    this.setMovingSpot()
    this.setAmbientLight()
  }

  setCity() {
    this.modelCity = new ModelCity({
      models: this.assets.models,
      time: this.time,
      listener: this.listener,
    })
    this.container.add(this.modelCity.container)
  }

  setAmbientLight() {
    this.light = new AmbientLightSource({
      color: 0xc2c2c2
    })
    this.container.add(this.light.container)
  }

  setSpotLightCity() {
    this.spotDebris = new SpotLightCity({
      position: {x:10,y:-15,z:-10},
      color: 0xFFFFFF,
      intensity: 1.5,
      distancePoint: 20,
      angleSpot: 0.5,
      positionTarget: {x:10,y:-50,z:-10},
    })

    this.spotAll = new SpotLightCity({
      position: {x:10,y:80,z:-10},
      color:0xded3a4,
      intensity: 0.1,
      distancePoint: 20,
      angleSpot: 1,
      positionTarget: {x:10,y:-50,z:-10},
    })
    this.container.add(this.spotDebris.container, this.spotAll.container)
  }

  setMovingSpot() {
    this.moving1 = new MovingSpot({
      time: this.time,
      assets: this.assets,
      position: {y:86,z:45},
      intensity: 10,
      distanceSpot: 480,
      angleSpot: 0.5,
      index: 20,
      direction: "x",
      start: 'start'
    })
    this.moving2 = new MovingSpot({
      time: this.time,
      assets: this.assets,
      position: {x:-56,y:86},
      intensity: 10,
      distanceSpot: 480,
      angleSpot: 0.5,
      index: 21,
      direction: "z",
      start: 'end'
    })
    this.moving3 = new MovingSpot({
      time: this.time,
      assets: this.assets,
      position: {y:86,z:-85},
      intensity: 10,
      distanceSpot: 480,
      angleSpot: 0.5,
      index: 22,
      direction: "x",
      start: 'end'
    })

    this.container.add(this.moving1.container, this.moving2.container, this.moving3.container)

  }
}
