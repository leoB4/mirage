import EventEmitter from './EventEmitter.js'

export default class Scroll extends EventEmitter {
  constructor() {
    // Get parent methods
    super()
    this.delta = 0

    // Set up
    document.addEventListener('wheel', (event) => {
       
        this.wheelMove(event)
        
    })
  }
  // on('tick')
  wheelMove(event) {
    this.delta = this.delta + event.deltaY; 
    this.trigger('wheelMove')
  }
  getDelta() {
      const delta = 0 + this.delta
      this.delta = 0
      return delta
  }
  // Cancel animation frame
  stop() {
    window.cancelAnimationFrame(this.ticker)
  }
}