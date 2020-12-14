import { PCFSoftShadowMap, Scene, WebGLRenderer, FogExp2, ShaderMaterial, Layers, MeshBasicMaterial, Vector2, Vector3, CatmullRomCurve3, TubeGeometry, DoubleSide, Mesh, AudioListener } from 'three'
import { EffectComposer } from '../postprocessing/EffectComposer.js';
import { RenderPass } from '../postprocessing/RenderPass.js';
import { ShaderPass } from '../postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '../postprocessing/UnrealBloomPass.js';
import vertexShader from '@shaders/vertexShader.vert'
import fragmentShader from '@shaders/fragmentShader.frag'

import * as dat from 'dat.gui'

import Sizes from '@tools/Sizes.js'
import Time from '@tools/Time.js'
import Loader from '@tools/Loader.js'
import Scroll from'@tools/Scroll.js'

import Camera from './Camera.js'
import World from '@world/index.js'

const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const FOG_HALO = 0x998162
const FOG_CITY = 0x111111
const FOG_FOREST = 0x998162

const BG_HALO = 0x998162
const BG_CITY = 0x111111
const BG_FOREST = 0x998162

const CURVE_CITY = [
  [-2.0, 0.0, 0.0] ,
  [1.0, 0.0, 0.0] ,
  [77.4046401977539, -3.2960415410343558e-06, 0.0] ,
  [81.968017578125, 9.47642993927002, 0.0] ,
  [84.21044158935547, 22.311573028564453, 0.0] ,
  [78.61073303222656, 36.510318756103516, 0.0] ,
  [68.00543212890625, 39.69784164428711, -4.688962459564209] ,
  [52.78571319580078, 29.230690002441406, -17.350929260253906] ,
  [52.785709381103516, -31.865507125854492, -17.350929260253906] ,
  [52.785709381103516, -31.865507125854492, -17.350929260253906] ,
  [52.785709381103516, -31.865507125854492, -17.350929260253906] ,
  [47.903438568115234, -39.060707092285156, -17.350929260253906] ,
  [40.504249572753906, -40.42531204223633, -17.350929260253906] ,
  [25.046457290649414, -39.80503463745117, -17.350929260253906] ,
  [16.858814239501953, -35.711212158203125, -17.350929260253906] ,
  [11.400386810302734, -23.92597007751465, -17.350929260253906] ,
  [10.780111312866211, -6.682300567626953, -17.350929260253906] ,
  [11.02822208404541, 12.794361114501953, -17.350929260253906] ,
  [10.656057357788086, 44.14234924316406, -17.350929260253906] ,
  [27.44816780090332, 44.14234924316406, -17.350929260253906] ,
  [84.70211791992188, 43.99348068237305, 1.6760950088500977] ,
  [84.85098266601562, -40.711429595947266, 1.6760950088500977] ,
  [-2.3846664428710938, -41.009159088134766, 1.6760950088500977] ,
].reverse()

const CURVE_HALO = [
  [-16.397377014160156, -37.26016616821289, -0.4423207938671112] ,
  [-21.780925750732422, -27.99492073059082, -0.11969171464443207] ,
  [-21.780925750732422, -15.335081100463867, -0.19549913704395294] ,
  [-21.780925750732422, -6.162383556365967, -0.043884292244911194] ,
  [-18.663127899169922, 18.35989761352539, 0.0] ,
  [-1.5774521827697754, 22.52930450439453, 0.0] ,
  [25.932178497314453, 22.8330020904541, 16.541690826416016] ,
  [24.590198516845703, -2.8000054359436035, 34.02119064331055] ,
  [26.311216354370117, -25.607934951782227, 13.661008834838867] ,
  [21.684602737426758, -35.49163818359375, 6.925106048583984] ,
]

const CURVE_LIST = [CURVE_CITY, CURVE_HALO]

export default class App {
  constructor(options) {
    // Set options
    this.canvas = options.canvas

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Loader()
    this.wheel = new Scroll()
    this.curveNumber = 0

    this.setConfig()
    this.cameraDisplacement()
    this.setRenderer()
    this.setTube()
    this.setCamera()
    this.setAudioListener()
    this.setWorld()
    this.setBloom()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()

    
    this.scene.fog = new FogExp2(FOG_CITY,0.0062)

    // Bloom layers
    this.bloomLayer = new Layers();
    this.bloomLayer.set( BLOOM_SCENE )

    // Materials
    this.darkMaterial = new MeshBasicMaterial( { color: "black", fog: false } );
		this.materials = {}

    // Set renderer
    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      canvas: this.canvas,
      antialias: true,
    })

    // Set background color
    this.renderer.setClearColor(BG_CITY, 1)
    // Set renderer pixel ratio & sizes
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    // Resize renderer on resize event
    this.sizes.on('resize', () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      )
    })
    this.renderer.shadowMap.type = PCFSoftShadowMap

    // Set RequestAnimationFrame with 60ips

    this.vectCam = new Vector3(this.p1.x, this.p1.y , this.p1.z)

    this.time.on('tick', () => {

      this.wheel.on('wheelMove', ()=>{
        if(this.curves[this.curveNumber] !== undefined){
          this.MoveCamera()
          
        }
      })
      
      this.vectCam.set(this.p1.x, this.p1.y , this.p1.z)
      this.camera.camera.position.lerp(this.vectCam, 0.1)
      this.camera.camera.lookAt(0,0,0)

      if (this.bloomComposer && this.finalComposer) {
        this.renderer.setClearColor(0x000000, 1)
        this.scene.traverse( this.darkenNonBloomed.bind(this) )
        this.bloomComposer.render()
        this.renderer.setClearColor(BG_CITY, 1)
        this.scene.traverse( this.restoreMaterial.bind(this) )
        this.finalComposer.render()
      }
    })
  }
  setCamera() {
    // Create camera instance
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
    })
    // Add camera to scene
    this.scene.add(this.camera.container)
  }
  setWorld() {
    // Create world instance
    this.world = new World({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      models: this.assets.models,
      textures: this.assets.textures,
      BLOOM_SCENE,
      listener: this.listener
    })
    // Add world to scene
    this.scene.add(this.world.container)
    // this.setGodRay()
  }
  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 420 })
    }
  }

  setBloom() {
    this.renderScene = new RenderPass( this.scene, this.camera.camera )
    this.bloomComposer = new EffectComposer( this.renderer )
		this.bloomComposer.renderToScreen = false

    this.bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    this.bloomPass.threshold = 0
    this.bloomPass.strength = 4
    this.bloomPass.radius = 0.8
    this.bloomPass.exposure = 1

    this.bloomComposer.addPass( this.renderScene )
    this.bloomComposer.addPass( this.bloomPass )

    this.finalPass = new ShaderPass(
      new ShaderMaterial( {
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        defines: {}
      } ), "baseTexture"
    );
    this.finalPass.needsSwap = true;

    this.finalComposer = new EffectComposer( this.renderer )
    this.finalComposer.addPass( this.renderScene )
    this.finalComposer.addPass( this.finalPass )
  }

  darkenNonBloomed( obj ) {
    if ( obj.isMesh && this.bloomLayer.test( obj.layers ) === false ) {
      this.materials[ obj.uuid ] = obj.material;
      obj.material = this.darkMaterial;
    }
  }

  restoreMaterial( obj ) {
    if ( this.materials[ obj.uuid ] ) {
      obj.material = this.materials[ obj.uuid ];
      delete this.materials[ obj.uuid ];
    }
  }
  setAudioListener() {
    this.listener = new AudioListener();
    this.camera.camera.add( this.listener );
  }

  cameraDisplacement() {

    this.curves = []

    CURVE_LIST.forEach(curve => {

      const scale = 2;

      for (var i = 0; i < curve.length; i++) {
        var x = curve[i][0] * scale;
        var y = curve[i][1] * scale;
        var z = curve[i][2] * scale;
        curve[i] = new Vector3(x, z, -y);
      }

      this.curves.push(new CatmullRomCurve3(curve))
    });

    this.p1 = this.curves[0].points[0]

    this.Campercentage = 0
    this.curveNumber = 0
  }

  setTube(){
    const radius = .25;
    const geometry = new TubeGeometry(this.curves[this.curveNumber], 50, radius, 10, false);

    const material = new MeshBasicMaterial({
      side: DoubleSide,
      color: 0xFF0000,
    });
    this.tube = new Mesh(geometry, material)
    // this.scene.add(this.tube);
  }

  MoveCamera() {
    this.Campercentage += this.wheel.getDelta() * 0.00007 ;
    
    this.prevCam = this.Campercentage;
    if(this.Campercentage < 0){
      this.Campercentage = this.Campercentage + 1
    }
    if(this.Campercentage > 1){
      this.Campercentage = this.Campercentage - 1
    }

    this.p1 = this.curves[this.curveNumber].getPointAt(this.Campercentage);
  }

  lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
  }
}
