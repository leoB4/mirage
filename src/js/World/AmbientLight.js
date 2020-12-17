import { Object3D, AmbientLight, Color } from 'three'

export default class AmbientLightSource {
  constructor(options) {
    this.color = options.color

    this.container = new Object3D()

    this.createAmbientLight()
  }

  createAmbientLight() {
    this.light = new AmbientLight(this.color)
    this.container.add(this.light)
  }
}
