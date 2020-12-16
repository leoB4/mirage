import {
    Object3D,
    PointLight,
    Color,
    CylinderBufferGeometry,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Mesh,
    DoubleSide,
    SphereBufferGeometry,
    PositionalAudio,
    AudioLoader,
    CircleBufferGeometry,
    ShaderMaterial,
    Vector2,
    TextureLoader,
    RepeatWrapping,
    Vector3
} from 'three'

import AmbianceSound from '@sounds/TEST1.mp3'

import {Water} from '@shaders/water.js'
import waterNorm from '@textures/waternormals.jpg'

import Altar from './Altar'


export default class WavyDisc {
    constructor(options) {
        // Set options
        this.time = options.time
        this.models = options.models
        this.BLOOM_SCENE = options.BLOOM_SCENE
        this.listener = options.listener
        this.numberAltars = 10
        this.scene = options.scene

        // Set up
        this.container = new Object3D()
        this.params = {
            color: 0xff0000,
            positionX: 0,
            positionY: 0,
            positionZ: 0,
        }

        this.spendTime = 0

        this.createDisc()
        this.createAltars()
        // this.setMovement()

    }
    createDisc() {

        // create the PositionalAudio object (passing in the listener)
        // this.sound = new PositionalAudio( this.listener );

        // load a sound and set it as the PositionalAudio object's buffer
        // const audioLoader = new AudioLoader();
        // audioLoader.load( AmbianceSound, (buffer)=> {
        //   this.sound.setBuffer( buffer );
        //   this.sound.setRefDistance( 10 );
        //   this.sound.setLoop(true)
        //   this.sound.play();
        // });

        // this.cerceau.add(this.sound)

        const disc = new CircleBufferGeometry(16, 64)

        this.water = new Water(
            disc,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new TextureLoader().load( waterNorm, function ( texture ) {

                    texture.wrapS = texture.wrapT = RepeatWrapping;

                } ),
                alpha: 1.0,
                sunDirection: new Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: this.scene.fog !== undefined
            }
        );


        this.water.rotation.x = -Math.PI / 2
        this.container.add(this.water)
        this.container.position.set(2, -33.3, 0)
    }

    createAltars() {
        this.altars = []

        for (let index = 0; index < this.numberAltars; index++) {

            this["altar-" + index] = new Altar({
                models: this.models,
                BLOOM_SCENE: this.BLOOM_SCENE
            })
            this["altar-" + index].container.position.set(16.5 * Math.cos(Math.PI * 2 * index / this.numberAltars), -0.3, 16.5 * Math.sin(Math.PI * 2 * index / this.numberAltars))
            this["altar-" + index].container.lookAt(0, 0, 0)
            //   this["altar-"+index].container.rotation.y = Math.PI/2
            this.altars.push("altar-" + index)
        }
        this.container.add(...this.altars.map(altar => this[altar].container))
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