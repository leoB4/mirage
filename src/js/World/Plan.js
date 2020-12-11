import { Object3D, SpotLight, Color, PlaneBufferGeometry, MeshPhongMaterial, Mesh, DoubleSide, BoxBufferGeometry} from 'three'

export default class Plan {
  constructor() {

    // Set up
    this.container = new Object3D()

    this.createPlan()
  }
  createPlan() {
    this.wall = new BoxBufferGeometry(30,30,5)
    this.wallMat = new MeshPhongMaterial(
        {
            color: 0xaeaeae,
            specular: 0xaeaeae,
            shininess: 15,
            flatShading: false,
            side: DoubleSide
        }
        )
    this.meshWall = new Mesh(this.wall, this.wallMat)
    this.meshWall.receiveShadow = true
    this.container.add(this.meshWall)
        
    this.container.position.z = -30
  }
  
}
