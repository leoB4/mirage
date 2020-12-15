import { Object3D, Color, SpotLight, SpotLightHelper, PlaneBufferGeometry, MeshBasicMaterial, Mesh, BoxBufferGeometry, BackSide } from 'three'

export default class MovingSpot {
  constructor(options) {
    // Set options
    this.debug = options.debug
    this.assets = options.assets
    this.time = options.time
    this.position = options.position
    this.positionTarget = options.positionTarget
    this.intensity = options.intensity
    this.distanceSpot = options.distanceSpot
    this.angleSpot = options.angleSpot
    this.index = options.index
    this.direction = options.direction
    this.start = options.start
    this.position[this.direction] = options.start === 'start' ? -50 : 50

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

    this.createMovingSpot()
    this.setMovement()
  }
  createMovingSpot() {
    const color = new Color(`hsl(${this.index/25*255}, 50%, 50%)`)
    
    this.light = new SpotLight(color, this.intensity, this.distanceSpot, this.angleSpot, 1, 2, 1)
    this.light.castShadow = true
    this.light.layers.enable(1)

    this.caddie = this.assets.models.caddie.scene.clone()
    this.caddie.scale.set(3,3,3)
    this.caddie.position.y = 3.6
    this.light.add(this.caddie)
    
    const box = new BoxBufferGeometry( 6, 0.5, 3.5 );
    const boxMaterial = new MeshBasicMaterial({color: color})
    this.boxLight = new Mesh(box, boxMaterial)
    this.boxLight.layers.enable(1)

    this.geometry = new PlaneBufferGeometry( 5, 20, 32 );
    this.material = new MeshBasicMaterial( {color: 0xffff00, opacity: 0, transparent: true} );
    this.plane = new Mesh( this.geometry, this.material );
    this.plane.position.y = -20
    this.plane.rotation.y = Math.PI/2

    this.light.target = this.plane
    
    this.container.add(this.light, this.plane, this.boxLight)
    this.container.position.set(this.position.x, this.position.y, this.position.z)

    if(this.direction === "z"){
      this.container.rotation.y = Math.PI/2
    }
  }

  setMovement() {
    this.time.on('tick', () => {
        this.container.position[this.direction] = Math.sin(this.moveTime)*100
        // this.light.color = new Color(`hsl(${(this.spendTime + (this.index * 360 / 25))%360}, 100%, 100%)`)
        
        this.moveTime += 0.0025
        
        this.spendTime += 0.1
    })
  }
  
}
