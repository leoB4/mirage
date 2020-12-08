import { Object3D, DirectionalLight,PointLight, Color, CylinderBufferGeometry, MeshStandardMaterial, MeshBasicMaterial, MeshPhongMaterial, Mesh, BackSide, DoubleSide, SphereBufferGeometry, SpotLight, RectAreaLight, DirectionalLightHelper, SpotLightHelper } from 'three'

export default class Cerceau {
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
    this.createLight()

  }
  createCerceau() {
    const cerceauSolid = new CylinderBufferGeometry(10,10,0.5,32,1,true)
    const materialS = new MeshPhongMaterial( { color: 0Xdedede, shininess: 0, side: DoubleSide} ) 
    this.cerceauS = new Mesh(cerceauSolid, materialS)
    this.cerceauS.position.set(
      this.params.positionX,
      this.params.positionY,
      this.params.positionZ
      )
      

    this.container.add(this.cerceauS)
  }

  createLight() {
    this.lights = []
    const sphere = new SphereBufferGeometry( 0.001, 16, 8 );

    for (let light = 0; light < 25; light++){
      const color = new Color(`hsl(${light/25*255}, 100%, 50%)`)
      this.lights[light] = new PointLight(color,1)
      this.lights[light].distance = 10
      this.lights[light].position.set(9.8 * Math.cos(Math.PI*2* light / 25  ),0,9.8 * Math.sin(Math.PI*2* light / 25))
      this.lights[light].add(new Mesh( sphere, new MeshBasicMaterial( {color} ) ))
      
    }
    

    this.container.add(...this.lights)
  }
  
}
