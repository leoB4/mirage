import {
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
  FogExp2,
  ShaderMaterial,
  Layers,
  MeshBasicMaterial,
  Vector2,
  Vector3,
  CatmullRomCurve3,
  TubeGeometry,
  DoubleSide,
  Mesh,
  AudioListener,
  Color
} from 'three'
import {
  EffectComposer
} from '../postprocessing/EffectComposer.js';
import {
  RenderPass
} from '../postprocessing/RenderPass.js';
import {
  ShaderPass
} from '../postprocessing/ShaderPass.js';
import {
  UnrealBloomPass
} from '../postprocessing/UnrealBloomPass.js';
import vertexShader from '@shaders/vertexShader.vert'
import fragmentShader from '@shaders/fragmentShader.frag'

import * as dat from 'dat.gui'

import Sizes from '@tools/Sizes.js'
import Time from '@tools/Time.js'
import Loader from '@tools/Loader.js'
import Scroll from '@tools/Scroll.js'

import Camera from './Camera.js'
import World from '@world/index.js'

const ENTIRE_SCENE = 0,
  BLOOM_SCENE = 1;

const DECAL_SCENE = -800

const FOG_HALO = new FogExp2(0xbaa984, 0.0062)
const FOG_CITY = new FogExp2(0x111111, 0.0062)
const FOG_FOREST = new FogExp2(0x212121, 0.0115)

const BG_HALO = new Color(0xbaa984)
const BG_CITY = new Color(0x111111)
const BG_FOREST = new Color(0x212121)

const CAM_FOREST = new Vector3(0, -20, 0)

const CAM_CITY1 = new Vector3(DECAL_SCENE, 0, 0)
const CAM_CITY2 = new Vector3(DECAL_SCENE, -80, 0)

const CAM_HALO = new Vector3(DECAL_SCENE * 2, 0, 0)



const CURVE_FOREST = [
  [13.030901908874512, 75.37338256835938, -14.02478313446045] ,
  [48.1744499206543, 67.99703979492188, -12.733448028564453] ,
  [67.728759765625, 54.041709899902344, -12.866325378417969] ,
  [80.81361389160156, 0.6296181678771973, -8.930191040039062] ,
  [60.53022766113281, -68.17855834960938, -3.476207733154297] ,
  [-80.7546615600586, -75.20010375976562, 55.36711120605469] ,
  [-71.68517303466797, 0.9931640625, -11.476207733154297] ,
  [-50.301544189453125, 56.439510345458984, -12.918855667114258] ,
  [56.61975860595703, 70.70716094970703, -11.476207733154297] ,
  [84.92964172363281, 0.9931640625, -11.476207733154297] ,
  [72.6324462890625, -68.00774383544922, -11.476207733154297] ,
  [0.21563720703125, -109.33997344970703, -12.159384727478027] ,
]

const CURVE_CITY = [
  [53.433467864990234, 11.135390281677246, 0.0] ,
  [44.12532424926758, -16.592355728149414, 0.0] ,
  [26.815427780151367, -33.902252197265625, 0.0] ,
  [-4.870485305786133, -38.596458435058594, 0.0] ,
  [-43.01093292236328, -27.154321670532227, 0.0] ,
  [-47.005226135253906, 3.358038902282715, 0.0] ,
  [-47.005226135253906, 3.358038902282715, 0.0] ,
  [-42.480525970458984, 34.88594436645508, 0.0] ,
  [-26.671791076660156, 43.62751770019531, -17.716094970703125] ,
  [0.21079158782958984, 50.135929107666016, -17.673828125] ,
  [24.263629913330078, 43.34454345703125, -17.673828125] ,
  [32.89435577392578, 30.32771110534668, -17.673828125] ,
  [34.16773986816406, 10.3140287399292, -17.673828125] ,
  [34.11802291870117, 10.3140287399292, 0.004039764404296875] ,
  [24.98628807067871, 10.3140287399292, 0.004039764404296875] ,
  [-24.07558250427246, 10.3140287399292, 0.004039764404296875] ,
]

const CURVE_HALO = [
  [0.22757530212402344, -2.221489429473877, -0.09338817000389099],
  [0.22757530212402344, -2.221489429473877, -0.09338817000389099],
  [-1.8654354810714722, -4.528411388397217, -0.19176408648490906],
  [-4.785167694091797, -7.040308952331543, -0.19941115379333496],
  [-7.4153642654418945, -7.535991191864014, 0.21019479632377625],
  [-9.737287521362305, -7.310304164886475, 0.5358425974845886],
  [-11.392159461975098, -6.660364627838135, 0.8325526714324951],
  [-12.330945014953613, -5.16754150390625, 0.8325526714324951],
  [-12.177045822143555, -2.9667816162109375, 0.8325526714324951],
  [-10.638052940368652, 0.6344614028930664, 0.4099334180355072],
  [-7.59529972076416, 4.540771961212158, -0.0728960633277893],
  [-3.8008956909179688, 5.488203525543213, 0.31443268060684204],
  [-0.7774209976196289, 4.188275337219238, 0.0],
  [1.0232001543045044, 1.0641200542449951, 0.0],
  [12.1620547771453857, -0.0138654708862305, 0.0],
  [2.2728655338287354, -11.17099666595459, 0.0],
  [-8.22275161743164, -11.026939392089844, -0.2890978753566742],
  [-7.304580211639404, -2.692131757736206, 0.22634437680244446],
  [-13.927192687988281, -0.6309871673583984, 0.0],
  [-13.942583084106445, 6.00206995010376, -1.2705764770507812],
  [-5.803896903991699, 9.718185424804688, 1.0827462673187256],
  [1.8961199522018433, 6.00206995010376, 0.0],
  [2.0, 0.0, -0.18960541486740112],
]

const CURVE_LIST = [CURVE_FOREST, CURVE_CITY, CURVE_HALO]

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
    this.camLook = CAM_FOREST.clone()
    this.camTarget = CAM_FOREST.clone()
    this.bgColor = BG_FOREST.clone()
    this.bgTarget = BG_FOREST.clone()

    // Document query Selector for UI
    this.jsMenu = options.jsMenu
    this.body = options.body
    this.navigation = options.navigation
    this.allNav = options.allNav
    this.jsForest = options.jsForest
    this.jsCity = options.jsCity
    this.jsHalo = options.jsHalo

    this.expoButton = options.expoButton

    this.jsLaunch = options.jsLaunch

    this.setConfig()
    this.cameraDisplacement()
    this.setRenderer()
    this.setCamera()
    this.setWorld()
    this.setBloom()
    this.showNav()
    this.changeCurve()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()

    this.scene.fog = FOG_FOREST.clone()

    // Bloom layers
    this.bloomLayer = new Layers();
    this.bloomLayer.set(BLOOM_SCENE)

    // Materials
    this.darkMaterial = new MeshBasicMaterial({
      color: "black",
      fog: false
    });
    this.materials = {}

    // Set renderer
    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      canvas: this.canvas,
      antialias: true,
    })

    // Set background color
    this.renderer.setClearColor(BG_FOREST, 1)
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

    this.vectCam = new Vector3(this.p1.x, this.p1.y +1.75, this.p1.z)

    this.time.on('tick', () => {
      this.wheel.on('wheelMove', () => {
        if (this.curves[this.curveNumber] !== undefined) {
          this.MoveCamera()
        }
      })

      this.vectCam.set(this.p1.x, this.p1.y +1.75, this.p1.z)
      this.camera.camera.position.lerp(this.vectCam, 0.1)
      this.camLook.lerp(this.camTarget, 0.05)
      this.camera.camera.lookAt(this.camLook)

      if (this.bloomComposer && this.finalComposer) {
        this.bgColor.lerp(this.bgTarget, 0.05)

        this.renderer.setClearColor(0x000000, 1)
        this.scene.traverse(this.darkenNonBloomed.bind(this))
        this.bloomComposer.render()
        this.renderer.setClearColor(this.bgColor, 1)
        this.scene.traverse(this.restoreMaterial.bind(this))
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
      DECAL_SCENE,
      scene: this.scene,
      jsLaunch: this.jsLaunch,
      camera: this.camera.camera
    })
    // Add world to scene
    // this.camera.camera.add(this.world.container.listener)
    console.log(this.world);
    this.scene.add(this.world.container)
    // this.setGodRay()
  }
  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({
        width: 420
      })
    }
  }

  setBloom() {
    this.renderScene = new RenderPass(this.scene, this.camera.camera)
    this.bloomComposer = new EffectComposer(this.renderer)
    this.bloomComposer.renderToScreen = false

    this.bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    this.bloomPass.threshold = 0
    this.bloomPass.strength = 4
    this.bloomPass.radius = 0.8
    this.bloomPass.exposure = 1

    this.bloomComposer.addPass(this.renderScene)
    this.bloomComposer.addPass(this.bloomPass)

    this.finalPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: {
          baseTexture: {
            value: null
          },
          bloomTexture: {
            value: this.bloomComposer.renderTarget2.texture
          }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        defines: {}
      }), "baseTexture"
    );
    this.finalPass.needsSwap = true;

    this.finalComposer = new EffectComposer(this.renderer)
    this.finalComposer.addPass(this.renderScene)
    this.finalComposer.addPass(this.finalPass)
  }

  darkenNonBloomed(obj) {
    if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
      this.materials[obj.uuid] = obj.material;
      obj.material = this.darkMaterial;
    }
  }

  restoreMaterial(obj) {
    if (this.materials[obj.uuid]) {
      obj.material = this.materials[obj.uuid];
      delete this.materials[obj.uuid];
    }
  }

  cameraDisplacement() {
    this.curves = []

    CURVE_LIST.forEach((curve, index) => {


      if (index === 0) {
        this.scale = 1
      } else if (index === 1) {
        this.scale = 4
      } else if (index === 2) {
        this.scale = 17
      }

      for (var i = 0; i < curve.length; i++) {
        var x = (curve[i][0] * this.scale) + (DECAL_SCENE) * index;
        var y = curve[i][1] * this.scale;
        var z = curve[i][2] * this.scale;
        curve[i] = new Vector3(x, z, -y);
      }

      this.curves.push(new CatmullRomCurve3(curve))
    });

    this.p1 = this.curves[0].points[0]

    this.Campercentage = 0
    this.curveNumber = 0
  }

  setTube() {
    const radius = .25;
    const geometry = new TubeGeometry(this.curves[this.curveNumber], 50, radius, 10, false);

    const material = new MeshBasicMaterial({
      side: DoubleSide,
      color: 0xFF0000,
    });
    this.tube = new Mesh(geometry, material)
    this.scene.add(this.tube);
  }

  MoveCamera() {
    this.Campercentage += this.wheel.getDelta() * 0.00007;

    const forestContainer = this.world.container.children.find(child => child.name === "forest")
    const haloContainer = this.world.container.children.find(child => child.name === "halo")
    const cityContainer = this.world.container.children.find(child => child.name === "city")


    if (this.curveNumber === 0) {
      if (this.camTarget !== CAM_FOREST) {
        this.camTarget = CAM_FOREST
      }

      // If for showing info
      if (this.Campercentage > 0.05 && this.Campercentage < 0.2) {
        this.jsForest.style.opacity = 1
        this.jsForest.classList.add('showed')
      }
      if (this.Campercentage > 0.2 && this.jsForest.classList.contains('showed')) {
        this.jsForest.style.opacity = 0
        this.jsForest.classList.remove('showed')
      }
      if (this.Campercentage < 0.2 && this.Campercentage > 0.05 && !this.jsForest.classList.contains('showed')) {
        this.jsForest.style.opacity = 1
        this.jsForest.classList.add('showed')
      }
      if (this.Campercentage < 0.05 && this.jsForest.classList.contains('showed')) {
        this.jsForest.style.opacity = 0
        this.jsForest.classList.remove('showed')
      }

      // If for moving curveCam
      if (this.Campercentage > 0.005) {
        if (haloContainer.visible === true) {
          haloContainer.visible = false
        }
        if (this.scene.fog !== FOG_FOREST) {
          this.scene.fog = FOG_FOREST
        }
        if (this.bgTarget !== BG_FOREST) {
          this.bgTarget = BG_FOREST
        }
      } else if (this.Campercentage <= 0.005) {
        if (this.camTarget !== CAM_HALO) {
          this.camTarget = CAM_HALO
        }
        if (haloContainer.visible === false) {
          haloContainer.visible = true
        }
        if (this.scene.fog !== FOG_HALO) {
          this.scene.fog = FOG_HALO
        }
        if (this.bgTarget !== BG_HALO) {
          this.bgTarget = BG_HALO
        }
      }
      if (this.Campercentage <= 0.995) {
        if (cityContainer.visible === true) {
          cityContainer.visible = false
        }
        if (this.scene.fog !== FOG_FOREST) {
          this.scene.fog = FOG_FOREST
        }
        if (this.bgTarget !== BG_FOREST) {
          this.bgTarget = BG_FOREST
        }
      } else if (this.Campercentage > 0.995) {
        if (this.camTarget !== CAM_CITY1) {
          this.camTarget = CAM_CITY1
        }
        if (cityContainer.visible === false) {
          cityContainer.visible = true
        }
        if (this.scene.fog !== FOG_CITY) {
          this.scene.fog = FOG_CITY
        }
        if (this.bgTarget !== BG_CITY) {
          this.bgTarget = BG_CITY
        }
      }
    } else if (this.curveNumber === 1) {
      if (this.Campercentage > 0.35 && this.Campercentage < 0.795 && this.camTarget !== CAM_CITY2) {
        this.camTarget = CAM_CITY2
      } else if ((this.Campercentage < 0.35 || this.Campercentage > 0.795) && this.camTarget !== CAM_CITY1) {
        this.camTarget = CAM_CITY1
      }

      // If form showing info
      if (this.Campercentage > 0.05 && this.Campercentage < 0.2) {
        this.jsCity.style.opacity = 1
        this.jsCity.classList.add('showed')
      }
      if (this.Campercentage > 0.2 && this.jsCity.classList.contains('showed')) {
        this.jsCity.style.opacity = 0
        this.jsCity.classList.remove('showed')
      }
      if (this.Campercentage < 0.2 && this.Campercentage > 0.05 && !this.jsCity.classList.contains('showed')) {
        this.jsCity.style.opacity = 1
        this.jsCity.classList.add('showed')
      }
      if (this.Campercentage < 0.05 && this.jsCity.classList.contains('showed')) {
        this.jsCity.style.opacity = 0
        this.jsCity.classList.remove('showed')
      }



      // If for moving Curve cam
      if (this.Campercentage > 0.005) {
        if (forestContainer.visible === true) {
          forestContainer.visible = false
        }
        if (this.scene.fog !== FOG_CITY) {
          this.scene.fog = FOG_CITY
        }
        if (this.bgTarget !== BG_CITY) {
          this.bgTarget = BG_CITY
        }
      } else if (this.Campercentage <= 0.005) {
        if (this.camTarget !== CAM_FOREST) {
          this.camTarget = CAM_FOREST
        }
        if (forestContainer.visible === false) {
          forestContainer.visible = true
        }
        if (this.scene.fog !== FOG_FOREST) {
          this.scene.fog = FOG_FOREST
        }
        if (this.bgTarget !== BG_FOREST) {
          this.bgTarget = BG_FOREST
        }
      }
      if (this.Campercentage <= 0.995) {
        if (haloContainer.visible === true) {
          haloContainer.visible = false
        }
        if (this.scene.fog !== FOG_CITY) {
          this.scene.fog = FOG_CITY
        }
        if (this.bgTarget !== BG_CITY) {
          this.bgTarget = BG_CITY
        }
      } else if (this.Campercentage > 0.995) {
        if (this.camTarget !== CAM_HALO) {
          this.camTarget = CAM_HALO
        }
        if (haloContainer.visible === false) {
          haloContainer.visible = true
        }
        if (this.scene.fog !== FOG_HALO) {
          this.scene.fog = FOG_HALO
        }
        if (this.bgTarget !== BG_HALO) {
          this.bgTarget = BG_HALO
        }
      }
    } else if (this.curveNumber === 2) {
      if (this.camTarget !== CAM_HALO) {
        this.camTarget = CAM_HALO
      }

      // If for showing info
      if (this.Campercentage > 0.05 && this.Campercentage < 0.2) {
        this.jsHalo.style.opacity = 1
        this.jsHalo.classList.add('showed')
      }
      if (this.Campercentage > 0.2 && this.jsHalo.classList.contains('showed')) {
        this.jsHalo.style.opacity = 0
        this.jsHalo.classList.remove('showed')
      }
      if (this.Campercentage < 0.2 && this.Campercentage > 0.05 && !this.jsHalo.classList.contains('showed')) {
        this.jsHalo.style.opacity = 1
        this.jsHalo.classList.add('showed')
      }
      if (this.Campercentage < 0.05 && this.jsHalo.classList.contains('showed')) {
        this.jsHalo.style.opacity = 0
        this.jsHalo.classList.remove('showed')
      }


      // If for moving Curve cam
      if (this.Campercentage > 0.005) {
        if (cityContainer.visible === true) {
          cityContainer.visible = false
        }
        if (this.scene.fog !== FOG_HALO) {
          this.scene.fog = FOG_HALO
        }
        if (this.bgTarget !== BG_HALO) {
          this.bgTarget = BG_HALO
        }
      } else if (this.Campercentage <= 0.005) {
        if (cityContainer.visible === false) {
          cityContainer.visible = true
        }
        if (this.scene.fog !== FOG_CITY) {
          this.scene.fog = FOG_CITY
        }
        if (this.bgTarget !== BG_CITY) {
          this.bgTarget = BG_CITY
        }
        if (this.camTarget !== CAM_CITY1) {
          this.camTarget = CAM_CITY1
        }
      }
      if (this.Campercentage <= 0.995) {
        if (forestContainer.visible === true) {
          forestContainer.visible = false
        }
        if (this.scene.fog !== FOG_HALO) {
          this.scene.fog = FOG_HALO
        }
        if (this.bgTarget !== BG_HALO) {
          this.bgTarget = BG_HALO
        }
      } else if (this.Campercentage > 0.995) {
        if (this.camTarget !== CAM_FOREST) {
          this.camTarget = CAM_FOREST
        }
        if (forestContainer.visible === false) {
          forestContainer.visible = true
        }
        if (this.scene.fog !== FOG_FOREST) {
          this.scene.fog = FOG_FOREST
        }
        if (this.bgTarget !== BG_FOREST) {
          this.bgTarget = BG_FOREST
        }
      }
    }

    if (this.Campercentage < 0 && this.curveNumber > 0) {
      this.Campercentage = 1
      this.curveNumber -= 1
    } else if (this.Campercentage < 0) {
      this.curveNumber = this.curves.length - 1
      this.Campercentage = 1
    }

    if (this.Campercentage > 1 && this.curveNumber < this.curves.length - 1) {
      this.Campercentage = 0
      this.curveNumber += 1
    } else if (this.Campercentage > 1) {
      this.curveNumber = 0
      this.Campercentage = 0
    }

    this.p1 = this.curves[this.curveNumber].getPointAt(this.Campercentage);
  }

  homeMadeLerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
  }

  showNav() {
    this.jsMenu.addEventListener('click', () => {
      this.body.classList.toggle('navOpen')
      this.navigation.classList.toggle('js-openNav')
      this.jsMenu.classList.toggle('js-buttonNavOpen')
    })
  }

  changeCurve() {
    this.expoButton.forEach(button => {
      button.addEventListener('click', () => {
        const forestContainer = this.world.container.children.find(child => child.name === "forest")
        const haloContainer = this.world.container.children.find(child => child.name === "halo")
        const cityContainer = this.world.container.children.find(child => child.name === "city")
        const CONTAINERS = [forestContainer, cityContainer, haloContainer]

        this.newCurveNumber = parseInt(button.dataset.curve)
        this.curveNumber = this.newCurveNumber
        this.Campercentage = 0.006
        this.MoveCamera()

        CONTAINERS.forEach((container, index) => {
          if (index === this.curveNumber) {
            container.visible = true
          } else {
            container.visible = false
          }
        })

        this.body.classList.toggle('navOpen')
        this.navigation.classList.toggle('js-openNav')
        this.jsMenu.classList.toggle('js-buttonNavOpen')
      })
    });
  }

}