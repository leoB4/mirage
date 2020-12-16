import {
    Object3D
} from 'three'

import ModelForest from './ModelForest'
import Altar from './Altar'
import SpotLightForest from './SpotForest'
import WavyDisc from './WavyDisc'

export default class Forest {
    constructor(options) {
        // Set options
        this.time = options.time
        this.debug = options.debug
        this.assets = options.assets
        this.listener = options.listener
        this.BLOOM_SCENE = options.BLOOM_SCENE
        this.scene = options.scene

        // Set up
        this.container = new Object3D()
        this.container.name = "city"

        this.createForest()

    }
    createForest() {
        this.setModelForest()
        this.setDisc()
        // this.setSpotLightForest()
    }

    setModelForest() {
        this.modelForest = new ModelForest({
            debug: this.debugFolder,
            models: this.assets.models,
            time: this.time,
            listener: this.listener,
        })
        this.container.add(this.modelForest.container)
    }

    setAltar() {
        this.altar = new Altar({
            debug: this.debugFolder,
            models: this.assets.models,
            time: this.time,
            listener: this.listener,
            BLOOM_SCENE: this.BLOOM_SCENE
        })
        this.container.add(this.altar.container)
    }

    setDisc(){
        this.disc = new WavyDisc({
            debug: this.debugFolder,
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
            intensity: 1,
            color: 0xFFFFFF,
            distancePoint: 1000,
            angleSpot: 1,
            positionTarget: {
                x: 0,
                y: 0,
                z: 0
            }
        })
        this.container.add(this.spot1.container)
    }

}