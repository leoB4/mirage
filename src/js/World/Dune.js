import { Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide } from 'three'

export default class Dune {
  constructor(options) {
    // Options
    this.time = options.time
    this.models = options.models

    // Set up
    this.container = new Object3D()

    this.createDune()
  }
  createDune() {
    this.dunes = this.models.dunes.scene
    this.dunes.castShadow = false
    this.dunes.receiveShadow = true
    this.dunes.scale.set(5.5,5.5,5.5)
    this.dunes.position.set(0,-35,-20)

    this.container.add(this.dunes)
  }
}
