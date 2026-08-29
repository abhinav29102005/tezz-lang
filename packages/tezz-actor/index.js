
const { Channel } = require('../tezz-channels/index.js');

class Actor {
  constructor(handler) {
    this.mailbox = new Channel();
    this.handler = handler;
    this.running = true;
    this._loop();
  }
  
  async _loop() {
    while (this.running) {
      const msg = await this.mailbox.pop();
      try {
        await this.handler(msg);
      } catch (e) {
        console.error("Actor crashed:", e);
        // Self-healing actor just restarts the loop
      }
    }
  }
  
  send(msg) {
    this.mailbox.push(msg);
  }
  
  stop() {
    this.running = false;
  }
}

function spawnActor(handler) {
  return new Actor(handler);
}

module.exports = { Actor, spawnActor };
