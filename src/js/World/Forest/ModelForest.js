import { Object3D, AudioLoader, PositionalAudio } from 'three'
import AmbianceSound from '@sounds/forest/foret_vent.mp3'

export default class ModelForest {
  constructor(options) {
    // Options
    this.time = options.time
    this.models = options.models
    this.listener = options.listener
    // Set up
    this.container = new Object3D()

    this.createModelForest()
  }
  createModelForest() {
    this.forest = this.models.forest.scene
    this.forest.castShadow = false
    this.forest.receiveShadow = true
    // this.forest.scale.set(5.5,5.5,5.5)
    this.forest.position.set(0,-1.7,0)

    // create the PositionalAudio object (passing in the listener)
    this.sound = new PositionalAudio( this.listener );

    // load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new AudioLoader();
    audioLoader.load( AmbianceSound, (buffer)=> {
      this.sound.setBuffer( buffer );
      this.sound.setRefDistance( 10 );
      this.sound.setLoop(true)
      this.sound.setVolume(1)
      this.sound.play();
    });

    this.forest.add(this.sound)

    this.container.add(this.forest)
  }
}
