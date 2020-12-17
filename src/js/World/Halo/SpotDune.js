import { Object3D, Color, SpotLight, PlaneBufferGeometry, MeshBasicMaterial, Mesh } from 'three'

export default class SpotDune {
  constructor(options) {
    this.position = options.position
    this.intensity = options.intensity
    this.distanceSpot = options.distanceSpot
    this.angleSpot = options.angleSpot

    this.container = new Object3D()
    this.color = 0xffebb0

    this.createAmbientLight()
  }

  createAmbientLight() {
    this.light = new SpotLight(this.color, this.intensity, this.distanceSpot, this.angleSpot, 1, 2, 1)
    this.light.position.set(this.position.x, this.position.y, this.position.z)

    this.geometry = new PlaneBufferGeometry( 5, 20, 32 )
    this.material = new MeshBasicMaterial( {color: 0xffff00, opacity: 0, transparent: true} )
    this.plane = new Mesh( this.geometry, this.material )
    this.plane.position.set(-85,-10,85)
    this.plane.rotation.y = Math.PI/2

    this.light.target = this.plane

    this.container.add(this.light, this.plane)
  }
}
