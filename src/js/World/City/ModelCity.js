import { Object3D } from 'three'

export default class ModelCity {
  constructor(options) {
    // Options
    this.time = options.time
    this.models = options.models

    // Set up
    this.container = new Object3D()

    this.createCity()
  }
  createCity() {
    this.city = this.models.city.scene
    this.city.castShadow = false
    this.city.receiveShadow = true
    this.city.scale.set(5.5,5.5,5.5)
    this.city.position.set(0,-35,-20)

    this.container.add(this.city)
  }
}
