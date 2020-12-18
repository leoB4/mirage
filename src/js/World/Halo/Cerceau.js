import { Object3D, CylinderBufferGeometry, Mesh, PositionalAudio, AudioLoader, ShaderMaterial, BackSide } from 'three'
import AmbianceSound from '@sounds/dunes/dune_ambiance.mp3'
import ledShaderVert from '@shaders/ledShader.vert'
import haloShaderFrag from '@shaders/haloShader.frag'

export default class Cerceau {
  constructor(options) {
    this.time = options.time
    this.models = options.models
    this.BLOOM_SCENE = options.BLOOM_SCENE
    this.listener = options.listener

    this.container = new Object3D()
    this.position = [0, 0, 0]

    this.createCerceau()
    this.setMovement()
  }
  createCerceau() {
    this.cerceau = this.models.cerceau.scene
    this.cerceau.position.set(...this.position)
    this.cerceau.scale.set(50,50,50)

    this.sound = new PositionalAudio( this.listener )
    const audioLoader = new AudioLoader()
    audioLoader.load( AmbianceSound, (buffer)=> {
      this.sound.setBuffer( buffer )
      this.sound.setRefDistance( 10 )
      this.sound.setLoop(true)
      this.sound.setVolume(1.2)
      this.sound.play()
    })
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
      this.position[0] - 0.1,
      this.position[1],
      this.position[2]
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
