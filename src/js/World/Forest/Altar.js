import {
    Object3D,
    SphereBufferGeometry,
    PointLight,
    MeshBasicMaterial,
    Mesh,
    PlaneBufferGeometry,
    DoubleSide,
    MeshPhongMaterial,
    RectAreaLight,
    Color
} from 'three'

export default class Altar {
    constructor(options) {
        // Options
        this.models = options.models
        this.BLOOM_SCENE = options.BLOOM_SCENE

        // Set up
        this.container = new Object3D()

        this.createAltar()
    }
    createAltar() {
        this.altar = this.models.altar.scene.clone()

        this.plane = new PlaneBufferGeometry(0.2, 5.6)
        this.planeMat = new MeshPhongMaterial({
            color: 0x555555,
            side: DoubleSide,
            shininess: 0
        })

        this.planeMesh = new Mesh(this.plane, this.planeMat)
        this.planeMesh.position.set(0, 3.2, 0)
        this.planeMesh.layers.enable(this.BLOOM_SCENE)

        this.altar.rotation.y = -Math.PI
        this.planeMesh.rotation.y = -Math.PI

        this.container.add(this.altar, this.planeMesh)
        // this.container.scale.set(5,5,5)
        this.setLight()
    }

    setLight() {
        this.lights = []
        const sphere = new SphereBufferGeometry(0.001, 16, 8);

        for (let index = 0; index < 4; index++) {
            const color = new Color(`hsl(${((index * 360 / 4))%360}, 100%, 100%)`)
            this["light-" + index] = new PointLight(color, 5)
            this["light-" + index].distance = 5
            //   this["light-"+index].add(new Mesh( sphere, new MeshBasicMaterial( {color: 0x0000FF, opacity: 0} ) ))
            this["light-" + index].position.set(0, 6 / 4 * index + 1, 0.1)
            this.lights.push("light-" + index)
            this["light-" + index].layers.enable(this.BLOOM_SCENE)
        }
        this.container.add(...this.lights.map(light => this[light]))
    }
}