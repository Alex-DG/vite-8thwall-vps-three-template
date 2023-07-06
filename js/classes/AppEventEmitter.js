/* eslint-disable */

/**
 
Simplified version of an event emitter

Example:

// Create a listener
const myListener = data => console.log(`Received data: ${data}`);

// Subscribe to an event
AppEventEmitter.on('myEvent', myListener);

// Emit an event with data
AppEventEmitter.emit('myEvent', 'Hello, world!');

// Unsubscribe from an event
AppEventEmitter.off('myEvent', myListener);

 */
class _AppEventEmitter {
  constructor() {
    this.events = {}
  }

  // Subscribe to an event
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = []
    }

    this.events[event].push(listener)
  }

  // Unsubscribe from an event
  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l) => l !== listener)
    }
  }

  // Emit an event
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(data))
    }
  }
}

const AppEventEmitter = new _AppEventEmitter()
export default AppEventEmitter
