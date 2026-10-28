let Channel;
try {
  Channel = require("../tezz-channels/index.js").Channel;
} catch (e1) {
  try {
    Channel = require("tezz-channels").Channel;
  } catch (e2) {
    class AsyncChannel {
      constructor() {
        this.queue = [];
        this.resolvers = [];
      }
      async push(val) {
        if (this.resolvers.length > 0) {
          const resolve = this.resolvers.shift();
          resolve(val);
        } else {
          this.queue.push(val);
        }
      }
      async pop() {
        if (this.queue.length > 0) {
          return this.queue.shift();
        }
        return new Promise(resolve => this.resolvers.push(resolve));
      }
    }
    Channel = AsyncChannel;
  }
}

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
