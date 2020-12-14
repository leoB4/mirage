import { Object3D, Color, SpotLight, SpotLightHelper, PlaneBufferGeometry, MeshBasicMaterial, Mesh } from 'three'

export default class SpotLightCity {
  constructor(options) {
    // Set options
    this.debug = options.debug
    this.position = options.position
    this.positionTarget = options.positionTarget
    this.intensity = options.intensity
    this.distanceSpot = options.distanceSpot
    this.angleSpot = options.angleSpot

    // Set up
    this.container = new Object3D()
    this.params = { 
        color: 0xffffff,
        positionX: 0,
        positionY: 0,
        positionZ: 0
    }

    this.createSpotCity()

    if (this.debug) {
      this.setDebug()
    }
  }
  createSpotCity() {
    this.light = new SpotLight(this.params.color, this.intensity, this.distanceSpot, this.angleSpot, 1, 2, 1)
    this.spotHelp = new SpotLightHelper(this.light)

    this.light.position.set(this.position.x, this.position.y, this.position.z)

    this.geometry = new PlaneBufferGeometry( 5, 20, 32 );
    this.material = new MeshBasicMaterial( {color: 0xffff00, opacity: 0, transparent: true} );
    this.plane = new Mesh( this.geometry, this.material );
    this.plane.position.set(this.positionTarget.x,this.positionTarget.y,this.positionTarget.z)
    this.plane.rotation.y = Math.PI/2

    this.light.target = this.plane
    
    this.container.add(this.light, this.plane)
  }
  setDebug() {
    this.debugFolder = this.debug.addFolder(`spotDune-${Math.random()}`)
    this.debugFolder.open()
    this.debugFolder
      .addColor(this.params, 'color')
      .name('Color')
      .onChange(() => {
        this.light.color = new Color(this.params.color)
      })
  }
}
