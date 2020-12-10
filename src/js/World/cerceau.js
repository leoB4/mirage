import { Object3D,PointLight, Color, CylinderBufferGeometry, MeshBasicMaterial, MeshPhongMaterial, Mesh, DoubleSide, SphereBufferGeometry } from 'three'

export default class Cerceau {
  constructor(options) {
    // Set options
    this.debug = options.debug
    this.time = options.time
    this.models = options.models

    // Set up
    this.container = new Object3D()
    this.params = {
      color: 0xff0000,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
    }

    this.spendTime = 0

    this.createCerceau()
    this.createLight()
    this.setMovement()

  }
  createCerceau() {
    this.cerceau = this.models.cerceau.scene
    this.cerceau.position.set(
      this.params.positionX,
      this.params.positionY,
      this.params.positionZ
      )
    this.cerceau.scale.set(50,50,50)

    const circleLum = new CylinderBufferGeometry(6.76,6.76,0.9,45,1,true)
    const materialS = new MeshPhongMaterial( { color: 0xdedede, shininess: 0, side: DoubleSide} )
    this.bloomCircle = new Mesh(circleLum, materialS)
    this.bloomCircle.position.set(
      this.params.positionX - 0.1,
      this.params.positionY,
      this.params.positionZ
      )
    this.bloomCircle.rotation.z = Math.PI/2
    this.bloomCircle.layers.enable(1)

    this.container.add(this.bloomCircle, this.cerceau)

  }

  createLight() {
    this.lights = []
    const sphere = new SphereBufferGeometry( 0.001, 16, 8 );

    for (let index = 0; index < 25; index++){
      const color = new Color(`hsl(${index/25*255}, 100%, 50%)`)
      this["light-"+index] = new PointLight(color, 1)
      this["light-"+index].distance = 10
      this["light-"+index].position.set(0, 6.7 * Math.cos(Math.PI*2* index / 25  ), 6.7 * Math.sin(Math.PI*2* index / 25))
      this["light-"+index].add(new Mesh( sphere, new MeshBasicMaterial( {color} ) ))
      this.lights.push("light-"+index)
      this["light-"+index].layers.enable(1)
    }
    this.container.add(...this.lights.map(light=>this[light]))
  }

  setMovement() {
    this.time.on('tick', () => {
      this.container.rotation.y += 0.005

      this.lights.forEach((light, index) => {
        this[light].color = new Color(`hsl(${(this.spendTime + (index * 360 / 25))%360}, 100%, 50%)`)
      })

      this.spendTime += 1
    })
  }

}
