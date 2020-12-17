import { Object3D,PointLight, Color, CylinderBufferGeometry, MeshBasicMaterial, MeshPhongMaterial, Mesh, DoubleSide, SphereBufferGeometry, PositionalAudio, AudioLoader, ShaderMaterial, BackSide } from 'three'
import AmbianceSound from '@sounds/dunes/dune_ambiance.mp3'
import ledShaderVert from '@shaders/ledShader.vert'
import haloShaderFrag from '@shaders/haloShader.frag'

export default class Cerceau {
  constructor(options) {
    // Set options
    this.debug = options.debug
    this.time = options.time
    this.models = options.models
    this.BLOOM_SCENE = options.BLOOM_SCENE
    this.listener = options.listener

    // Set up
    this.container = new Object3D()
    this.params = {
      color: 0xff0000,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
    }

    this.createCerceau()
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
      this.sound.setVolume(0.3)
      this.sound.play();
    });


    this.cerceau = this.models.cerceau.scene
    this.cerceau.position.set(
      this.params.positionX,
      this.params.positionY,
      this.params.positionZ
      )
    this.cerceau.scale.set(50,50,50)

    this.cerceau.add(this.sound)

    const circleLum = new CylinderBufferGeometry(6.76,6.76,0.9,45,1,true)
    const shaderMaterial = new ShaderMaterial( {
      fragmentShader: haloShaderFrag,
      vertexShader: ledShaderVert,
      uniforms: {
          time: { value: - Math.PI / 2 },
      },
      side: BackSide
    } )

    this.bloomCircle = new Mesh(circleLum, shaderMaterial)
    this.bloomCircle.position.set(
      this.params.positionX - 0.1,
      this.params.positionY,
      this.params.positionZ
      )
    this.bloomCircle.rotation.z = Math.PI/2
    this.bloomCircle.layers.enable(this.BLOOM_SCENE)

    this.container.add(this.bloomCircle, this.cerceau)
  }

  setMovement() {
    this.time.on('tick', () => {
      this.container.rotation.y += 0.005

      this.bloomCircle.material.uniforms.time.value += 0.002
      if (this.bloomCircle.material.uniforms.time.value > 4 + 2 * Math.PI / 2.) {
        this.bloomCircle.material.uniforms.time.value = 0
      }
    })
  }

}
