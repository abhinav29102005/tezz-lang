
const sharp = require('sharp');

class ImageProcessor {
  constructor(inputPath) {
    this.image = sharp(inputPath);
  }
  
  resize(width, height) {
    this.image = this.image.resize(width, height);
    return this;
  }
  
  grayscale() {
    this.image = this.image.grayscale();
    return this;
  }
  
  async save(outputPath) {
    await this.image.toFile(outputPath);
  }
}


module.exports = { ImageProcessor, createImageProcessor: () => new ImageProcessor() };
