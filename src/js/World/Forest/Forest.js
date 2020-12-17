import {
    Object3D
} from 'three'
import AmbientLightSource from '@world/AmbientLight'

import ModelForest from './ModelForest'
import Altar from './Altar'
import SpotLightForest from './SpotForest'
import WavyDisc from './WavyDisc'

export default class Forest {
    constructor(options) {
        this.time = options.time
        this.assets = options.assets
        this.listener = options.listener
        this.BLOOM_SCENE = options.BLOOM_SCENE
        this.scene = options.scene

        this.container = new Object3D()
        this.container.name = "forest"

        this.createForest()
    }

    createForest() {
        this.setModelForest()
        this.setDisc()
        this.setAmbientLight()
        this.setSpotLightForest()
    }

    setAmbientLight() {
        this.light = new AmbientLightSource({
          color: 0xaeaeae
        })
        this.container.add(this.light.container)
    }

    setModelForest() {
        this.modelForest = new ModelForest({
            models: this.assets.models,
            time: this.time,
            listener: this.listener,
        })
        this.container.add(this.modelForest.container)
        this.container.position.set(0,-20,0)
    }

    setAltar() {
        this.altar = new Altar({
            models: this.assets.models,
            time: this.time,
            listener: this.listener,
            BLOOM_SCENE: this.BLOOM_SCENE
        })
        this.container.add(this.altar.container)
    }

    setDisc(){
        this.disc = new WavyDisc({
            models: this.assets.models,
            time: this.time,
            listener: this.listener,
            scene: this.scene,
            BLOOM_SCENE: this.BLOOM_SCENE
        })
        this.container.add(this.disc.container)
    }

    setSpotLightForest() {
        this.spot1 = new SpotLightForest({
            position: {
                x: 0,
                y: 1000,
                z: 0
            },
            intensity: 0.3,
            color: 0xFFFFFF,
            distancePoint: 1000,
            angleSpot: 0.5,
            positionTarget: {
                x: 0,
                y: 0,
                z: 0
            }
        })
        this.container.add(this.spot1.container)
    }
}