
import EventEmitter from './EventEmitter.js'

export default class Scroll extends EventEmitter {
  constructor() {
    // Get parent methods
    super()

    // Set up
    this.mouseX = 0
    this.mouseY = 0
    document.addEventListener('wheel', (event) => {
        this.mouseMove(event)
    })
  }
  // on('tick')
  wheelMove(event) {
    this.mouseX = event.clientX
    this.mouseY = event.clientY
    this.trigger('wheelMove')
  }
  // Cancel animation frame
  stop() {
    window.cancelAnimationFrame(this.ticker)
  }
}