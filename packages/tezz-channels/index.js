
class Channel {
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


module.exports = { Channel, createChannel: () => new Channel() };
