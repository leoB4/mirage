import { Object3D, AudioLoader, PositionalAudio } from 'three'
import AmbianceSound from '@sounds/forest/foret_vent.mp3'

export default class ModelForest {
  constructor(options) {
    this.time = options.time
    this.models = options.models
    this.listener = options.listener

    this.container = new Object3D()

    this.createModelForest()
  }
  createModelForest() {
    this.forest = this.models.forest.scene
    this.forest.castShadow = false
    this.forest.receiveShadow = true
    this.forest.position.set(0,-1.7,0)

    this.sound = new PositionalAudio( this.listener )
    const audioLoader = new AudioLoader()
    audioLoader.load( AmbianceSound, (buffer)=> {
      this.sound.setBuffer( buffer )
      this.sound.setRefDistance( 10 )
      this.sound.setLoop(true)
      this.sound.setVolume(1)
      this.sound.play()
    })
    this.forest.add(this.sound)

    this.container.add(this.forest)
  }
}
