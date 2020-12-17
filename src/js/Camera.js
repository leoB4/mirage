import { Object3D, PerspectiveCamera } from 'three'

export default class Camera {
  constructor(options) {
    this.sizes = options.sizes
    this.renderer = options.renderer

    this.container = new Object3D()

    this.setCamera()
  }

  setCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this.sizes.viewport.width / this.sizes.viewport.height,
      0.1,
      1000
    )
    this.container.add(this.camera)
    this.sizes.on('resize', () => {
      this.camera.aspect = this.sizes.viewport.width / this.sizes.viewport.height
      this.camera.updateProjectionMatrix()
    })
  }
}
