import { Object3D } from 'three'

import ModelCity from './ModelCity.js'
import SpotLightCity from './SpotLightCity'
import MovingSpot from'./MovingSpot'
import Plan from '../Plan'

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
      this.debugFolder = this.debug.addFolder('city')
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
      color: 0xFFFFFF,
      distancePoint: 90,
      angleSpot: 0.25,
      positionTarget: {x:80,y:-10,z:-80}
    })

    this.spot2 = new SpotLightCity({
      position: {x:0,y:50,z:0},
      intensity: 1.5,
      color: 0xFFFFFF,
      distancePoint: 200,
      angleSpot: 0.5,
      positionTarget: {x:-80,y:-10,z:20},
    })

    this.spotDebris = new SpotLightCity({
      position: {x:10,y:-10,z:-10},
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
    this.container.add(this.spot1.container, this.spot2.container, this.spotDebris.container, this.spotAll.container)
  }

  setMovingSpot() {
    this.moving1 = new MovingSpot({
      time: this.time,
      assets: this.assets,
      position: {y:86,z:45},
      intensity: 8,
      distanceSpot: 280,
      angleSpot: 0.5,
      index: 20,
      direction: "x",
      start: 'start'
    })
    this.moving2 = new MovingSpot({
      time: this.time,
      assets: this.assets,
      position: {x:-56,y:86},
      intensity: 8,
      distanceSpot: 280,
      angleSpot: 0.5,
      index: 21,
      direction: "z",
      start: 'end'
    })
    this.moving3 = new MovingSpot({
      time: this.time,
      assets: this.assets,
      position: {y:86,z:-85},
      intensity: 8,
      distanceSpot: 280,
      angleSpot: 0.5,
      index: 22,
      direction: "x",
      start: 'end'
    })

    this.container.add(this.moving1.container, this.moving2.container, this.moving3.container)
    
  }

  setFloor() {
    this.floor = new Plan()
    this.container.add(this.floor.container)
  }
}
