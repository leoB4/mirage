import { Object3D, PositionalAudio, AudioLoader, SphereBufferGeometry, MeshPhongMaterial, Mesh } from 'three'
import AmbianceSound from '@sounds/city/ville.mp3'
import RockSound from '@sounds/city/rock.mp3'

export default class ModelCity {
  constructor(options) {
    this.time = options.time
    this.models = options.models
    this.listener = options.listener

    this.container = new Object3D()

    this.createCity()
  }

  createCity() {
    this.city = this.models.city.scene
    this.city.castShadow = true
    this.city.children[0].children.forEach(element => {
      element.castShadow = true
    })
    this.city.scale.set(5.5,5.5,5.5)
    this.city.position.set(0,-35,-20)

    this.soundVille = new PositionalAudio( this.listener )
    const audioTenteLoader = new AudioLoader()
    audioTenteLoader.load( AmbianceSound, (buffer)=> {
      this.soundVille.setBuffer( buffer )
      this.soundVille.setRefDistance( 10 )
      this.soundVille.setLoop(true)
      this.soundVille.setVolume(1)
      this.soundVille.play()
    })

    this.soundGravat = new PositionalAudio( this.listener )
    const audioGravat = new AudioLoader()
    audioGravat.load( RockSound, (buffer)=> {
      this.soundGravat.setBuffer( buffer )
      this.soundGravat.setRefDistance( 3 )
      this.soundGravat.setLoop(true)
      this.soundGravat.setVolume(1)
      this.soundGravat.play()
    })

    const sphereGeo = new SphereBufferGeometry( 0.001, 16, 8 )
    const sphereMat = new MeshPhongMaterial({color: 0xFF0000, opacity: 0})
    this.sphereMesh = new Mesh(sphereGeo, sphereMat)
    this.sphereMesh.position.set(0,25,0)

    const sphereGeo2 = new SphereBufferGeometry( 0.001, 16, 8 )
    const sphereMat2 = new MeshPhongMaterial({color: 0xFF0000, opacity: 0})
    this.sphereMesh2 = new Mesh(sphereGeo2, sphereMat2)
    this.sphereMesh2.position.set(0,-20,0)

    this.sphereMesh.add(this.soundVille)
    this.sphereMesh2.add(this.soundGravat)

    this.container.add(this.city, this.sphereMesh, this.sphereMesh2 )
  }
}
