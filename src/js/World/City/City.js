import { Object3D } from 'three'

import ModelCity from './ModelCity.js'
import SpotLightCity from './SpotLightCity'
import MovingSpot from'./MovingSpot'

export default class City {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.listener = options.listener

    // Set up
    this.container = new Object3D()

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Halo')
      this.debugFolder.open()
    }
    this.createCity()

  }
  createCity() {
    this.setCity()
    this.setSpotLightCity()
    this.setMovingSpot()
  }
  
  setCity() {
    this.modelCity = new ModelCity({
      debug: this.debugFolder,
      models: this.assets.models,
      time: this.time,
      listener: this.listener,
    })
    this.container.add(this.modelCity.container)
  }

  setSpotLightCity() {
    this.spot1 = new SpotLightCity({
      position: {x:-50,y:50,z:-100},
      intensity: 1.5,
      distancePoint: 90,
      angleSpot: 0.25,
      positionTarget: {x:80,y:-10,z:-80}
    })

    this.spot2 = new SpotLightCity({
      position: {x:0,y:50,z:0},
      intensity: 1.5,
      distancePoint: 200,
      angleSpot: 0.5,
      positionTarget: {x:-80,y:-10,z:20},
    })
    this.container.add(this.spot1.container, this.spot2.container)
  }

  setMovingSpot() {
    this.moving1 = new MovingSpot({
      time: this.time,
      position: {y:50,z:40},
      intensity: 5,
      distancePoint: 200,
      angleSpot: 0.7,
      index: 1,
      direction: "x",
      start: 'start'
    })
    this.moving2 = new MovingSpot({
      time: this.time,
      position: {x:40,y:50},
      intensity: 5,
      distancePoint: 200,
      angleSpot: 0.7,
      index: 20,
      direction: "z",
      start: 'end'
    })
    this.moving3 = new MovingSpot({
      time: this.time,
      position: {y:50,z:-40},
      intensity: 5,
      distancePoint: 200,
      angleSpot: 0.7,
      index: 3,
      direction: "x",
      start: 'end'
    })
    this.container.add(this.moving1.container, this.moving2.container, this.moving3.container)
  }
}
