import { Object3D } from 'three'

export default class ModelForest {
  constructor(options) {
    // Options
    this.time = options.time
    this.models = options.models

    // Set up
    this.container = new Object3D()

    this.createModelForest()
  }
  createModelForest() {
    this.forest = this.models.forest.scene
    this.forest.castShadow = false
    this.forest.receiveShadow = true
    // this.forest.scale.set(5.5,5.5,5.5)
    this.forest.position.set(0,-35,0)

    this.container.add(this.forest)
  }
}
