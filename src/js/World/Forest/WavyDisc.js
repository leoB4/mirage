import {
    Object3D,
    Color,
    PositionalAudio,
    AudioLoader,
    CircleBufferGeometry,
    TextureLoader,
    RepeatWrapping,
    Vector3
} from 'three'

import waterSound from '@sounds/forest/eau.mp3'
import AmbianceSound from '@sounds/forest/foret_ambiance.mp3'

import { Water } from 'three/examples/jsm/objects/Water'
import waterNorm from '@textures/waternormals.jpg'

import Altar from './Altar'

export default class WavyDisc {
    constructor(options) {
        this.time = options.time
        this.models = options.models
        this.BLOOM_SCENE = options.BLOOM_SCENE
        this.listener = options.listener
        this.scene = options.scene

        this.container = new Object3D()
        this.spendTime = 0
        this.numberAltars = 10

        this.createDisc()
        this.createAltars()
        this.setMovement()
    }
    createDisc() {
        this.sound = new PositionalAudio( this.listener )
        const audioLoader = new AudioLoader()
        audioLoader.load( waterSound, (buffer)=> {
          this.sound.setBuffer( buffer )
          this.sound.setRefDistance( 10 )
          this.sound.setLoop(true)
          this.sound.setVolume(3)
          this.sound.play()
        })

        this.soundAmbiance = new PositionalAudio( this.listener )
        const audioAmbiance = new AudioLoader()
        audioAmbiance.load( AmbianceSound, (buffer)=> {
          this.soundAmbiance.setBuffer( buffer )
          this.soundAmbiance.setRefDistance( 6 )
          this.soundAmbiance.setLoop(true)
          this.soundAmbiance.setVolume(1)
          this.soundAmbiance.play()
        })

        const disc = new CircleBufferGeometry(16, 64)
        this.water = new Water(
            disc,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new TextureLoader().load( waterNorm, function ( texture ) {
                    texture.wrapS = texture.wrapT = RepeatWrapping
                } ),
                alpha: 1.0,
                sunDirection: new Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x08192b,
                distortionScale: 3.7,
                fog: this.scene.fog !== undefined
            }
        )
        this.water.rotation.x = -Math.PI / 2

        this.container.add(this.water, this.sound, this.soundAmbiance)
        this.container.position.set(2, 0, 0)
    }

    createAltars() {
        this.altars = []
        for (let index = 0; index < this.numberAltars; index++) {
            this["altar-" + index] = new Altar({
                models: this.models,
                BLOOM_SCENE: this.BLOOM_SCENE,
                time: this.time,
                index,
                number: this.numberAltars
            })
            this["altar-" + index].container.position.set(16.5 * Math.cos(Math.PI * 2 * index / this.numberAltars), -0.3, 16.5 * Math.sin(Math.PI * 2 * index / this.numberAltars))
            this["altar-" + index].container.lookAt(0, 0, 0)
            this.altars.push("altar-" + index)
        }
        this.container.add(...this.altars.map(altar => this[altar].container))
    }

    setMovement() {
        this.time.on('tick', () => {
            this.water.material.uniforms[ 'time' ].value += 0.001
        })
    }
}