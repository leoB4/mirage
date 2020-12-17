import '@style/style.styl'
import App from '@js/App.js'

new App({
  canvas: document.querySelector('#_canvas'),

  jsMenu: document.querySelector('.js-menu'),
  body: document.querySelector('body'),
  navigation: document.querySelector('.nav'),
  jsForest: document.querySelector('.js-forest'),
  jsCity: document.querySelector('.js-city'),
  jsHalo: document.querySelector('.js-halo'),

  expoButton: document.querySelectorAll('.expoButton'),
  jsLaunch: document.querySelector('.js-launch')
})
