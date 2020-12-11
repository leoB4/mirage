import { Object3D,PointLight, Color, CylinderBufferGeometry, MeshBasicMaterial, MeshPhongMaterial, Mesh, DoubleSide, SphereBufferGeometry, PositionalAudio, AudioLoader } from 'three'
import AmbianceSound from '@sounds/TEST1.mp3'
import {PositionalAudioHelper} from '@tools/PositionalAudioHelper'

export default class Cerceau {
  constructor(options) {
    // Set options
    this.debug = options.debug
    this.time = options.time
    this.models = options.models
    this.listener = options.listener

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

    // create the PositionalAudio object (passing in the listener)
    this.sound = new PositionalAudio( this.listener );

    // load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new AudioLoader();
    audioLoader.load( AmbianceSound, (buffer)=> {
      this.sound.setBuffer( buffer );
      this.sound.setRefDistance( 10 );
      this.sound.setLoop(true)
      this.sound.play();
    });

    this.helper = new PositionalAudioHelper( this.sound, 10 );
    this.sound.add( this.helper );

    this.cerceau = this.models.cerceau.scene
    this.cerceau.position.set(
      this.params.positionX,
      this.params.positionY,
      this.params.positionZ
      )
    this.cerceau.scale.set(50,50,50)
    this.cerceau.add(this.sound)
    
    const circleLum = new CylinderBufferGeometry(6.76,6.76,0.9,45,1,true)
    const materialS = new MeshPhongMaterial( { color: 0xdedede, shininess: 0, side: DoubleSide} ) 
    this.bloomCircle = new Mesh(circleLum, materialS)
    this.bloomCircle.position.set(
      this.params.positionX - 0.1,
      this.params.positionY,
      this.params.positionZ
      )
    this.bloomCircle.rotation.z = Math.PI/2

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
    }
    // console.log(this.lights.map(light=>));
    // console.log(this.lights.map(light=>this[light]));
    this.container.add(...this.lights.map(light=>this[light]))
  }

  setMovement() {
    this.time.on('tick', () => {
      this.container.rotation.y += 0.005
      // this.container.rotation.x += 0.005
      // this.container.rotation.z += 0.005

      this.lights.forEach((light, index) => {
        this[light].color = new Color(`hsl(${(this.spendTime + (index * 360 / 25))%360}, 100%, 50%)`)
      });


      this.spendTime += 1
    })
  }
  
}
