import { Object3D, Color, SpotLight, SpotLightHelper, PlaneBufferGeometry, MeshBasicMaterial, Mesh } from 'three'

export default class MovingSpot {
  constructor(options) {
    // Set options
    this.debug = options.debug
    this.time = options.time
    this.position = options.position
    this.positionTarget = options.positionTarget
    this.intensity = options.intensity
    this.distanceSpot = options.distanceSpot
    this.angleSpot = options.angleSpot
    this.index = options.index
    this.direction = options.direction
    this.start = options.start
    this.position[this.direction] = options.start === 'start' ? -100 : 100

    // Set up
    this.container = new Object3D()
    this.params = { 
        color: 0xffffff,
        positionX: 0,
        positionY: 0,
        positionZ: 0
    }

    this.spendTime = 0
    this.moveTime = this.start === 'start' ? Math.PI / 2 : -Math.PI / 2
    console.log(Math.sin(this.moveTime));

    this.createMovingSpot()
    this.setMovement()
  }
  createMovingSpot() {
    const color = new Color(`hsl(${this.index/25*255}, 100%, 50%)`)
    this.light = new SpotLight(color, this.intensity, this.distanceSpot, this.angleSpot, 1, 2, 1)
    this.spotHelp = new SpotLightHelper(this.light)

    this.light.position.set(this.position.x, this.position.y, this.position.z)

    this.geometry = new PlaneBufferGeometry( 5, 20, 32 );
    this.material = new MeshBasicMaterial( {color: 0xffff00, opacity: 0, transparent: true} );
    this.plane = new Mesh( this.geometry, this.material );
    this.plane.position.set(this.position.x,-20,this.position.z)
    this.plane.rotation.y = Math.PI/2

    this.light.target = this.plane
    
    this.container.add(this.light, this.plane)
  }

  setMovement() {
    this.time.on('tick', () => {
        this.light.position[this.direction] = Math.sin(this.moveTime)*100
        this.plane.position[this.direction] = Math.sin(this.moveTime)*100
        // this.light.color = new Color(`hsl(${(this.spendTime + (this.index * 360 / 25))%360}, 100%, 100%)`)
        
        this.moveTime += 0.0025
        
        this.spendTime += 0.1
    })
  }
  
}
