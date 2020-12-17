import EventEmitter from './EventEmitter.js'

export default class Scroll extends EventEmitter {
  constructor() {
    super()

    this.delta = 0

    document.addEventListener('wheel', (event) => {
        this.wheelMove(event)
    })
  }

  wheelMove(event) {
    this.delta = this.delta + event.deltaY
    this.trigger('wheelMove')
  }

  getDelta() {
      const delta = 0 + this.delta
      this.delta = 0
      return delta
  }

  stop() {
    window.cancelAnimationFrame(this.ticker)
  }
}