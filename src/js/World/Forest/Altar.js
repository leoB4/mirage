import {
    Object3D,
    Mesh,
    PlaneBufferGeometry,
    ShaderMaterial,
} from 'three'

import ledShaderVert from '@shaders/ledShader.vert'
import ledShaderFrag from '@shaders/ledShader.frag'

export default class Altar {
    constructor(options) {
        this.models = options.models
        this.BLOOM_SCENE = options.BLOOM_SCENE
        this.time = options.time
        this.index = options.index
        this.number = options.number

        this.container = new Object3D()

        this.createAltar()
        this.setMovement()
    }

    createAltar() {
        this.altar = this.models.altar.scene.clone()
        this.altar.rotation.y = -Math.PI

        this.plane = new PlaneBufferGeometry(0.2, 5.6)
        this.shaderMaterial = new ShaderMaterial( {
            fragmentShader: ledShaderFrag,
            vertexShader: ledShaderVert,
            uniforms: {
                M_PI: { value: Math.PI },
                time: { value: Math.PI / 2 },
                index: { value: this.index },
                number: { value: this.number }
            }
        } )
        this.planeMesh = new Mesh(this.plane, this.shaderMaterial)
        this.planeMesh.position.set(0, 3.2, 0)
        this.planeMesh.layers.enable(this.BLOOM_SCENE)
        this.planeMesh.rotation.y = -Math.PI
        this.planeMesh.rotation.x = Math.PI

        this.container.add(this.altar, this.planeMesh)
    }

    setMovement() {
        this.time.on('tick', () => {
            this.planeMesh.material.uniforms.time.value += 0.02
            if (this.planeMesh.material.uniforms.time.value >= 30 * Math.PI / 2) {
                this.planeMesh.material.uniforms.time.value = 0
            }
        })
    }
}