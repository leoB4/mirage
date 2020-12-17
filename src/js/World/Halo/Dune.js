import { Object3D, PositionalAudio, AudioLoader, SphereBufferGeometry, MeshPhongMaterial, Mesh } from 'three'
import Vent from '@sounds/dunes/vent.mp3'
import Tente from '@sounds/dunes/tente.mp3'
export default class Dune {
  constructor(options) {
    // Options
    this.time = options.time
    this.models = options.models
    this.listener = options.listener

    // Set up
    this.container = new Object3D()

    this.createDune()
  }
  createDune() {
    this.dunes = this.models.dunes.scene
    this.dunes.castShadow = false
    this.dunes.receiveShadow = true
    this.dunes.scale.set(80,80,80)
    this.dunes.position.set(0,-35,0)

    this.sound = new PositionalAudio( this.listener );
    // load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new AudioLoader();
    audioLoader.load( Vent, (buffer)=> {
      this.sound.setBuffer( buffer );
      this.sound.setRefDistance( 10 );
      this.sound.setLoop(true)
      this.sound.play();
    });

    this.soundTente = new PositionalAudio( this.listener );
    // load a sound and set it as the PositionalAudio object's buffer
    const audioTenteLoader = new AudioLoader();
    audioTenteLoader.load( Tente, (buffer)=> {
      this.soundTente.setBuffer( buffer );
      this.soundTente.setRefDistance( 7 );
      this.soundTente.setLoop(true)
      this.soundTente.setVolume(1)
      this.soundTente.play();
    });

    const sphereGeo = new SphereBufferGeometry( 0.0001, 16, 8 );
    const sphereMat = new MeshPhongMaterial({color: 0xFF0000, opacity: 0});
    this.sphereMesh = new Mesh(sphereGeo, sphereMat)
    this.sphereMesh.position.set(50,-20,-100)

    this.sphereMesh.add(this.soundTente)


    this.dunes.add(this.sound)
    this.container.add(this.dunes, this.sphereMesh)
  }
}
