import { Object3D, DirectionalLight,PointLight, Color, CylinderBufferGeometry, MeshStandardMaterial, MeshBasicMaterial, MeshPhongMaterial, Mesh, BackSide, DoubleSide, SphereBufferGeometry, SpotLight } from 'three'

export default class CerceauLight {
  constructor(options) {
    // Set options
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.params = {
      color: 0xff0000,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
    }

    this.createCerceau()

  }
  createCerceau() {
    const cerceau= new CylinderBufferGeometry(0.50,0.50,0.5,32,1,true)
    const materialS = new MeshPhongMaterial( { color: 0Xff0000, shininess: 0, side: DoubleSide} ) 
    this.light = new PointLight(0x0000FF)
    this.light.add(new Mesh(cerceau, materialS))

    this.light.castShadow = true
    this.container.add(this.light)
  }
  
}
