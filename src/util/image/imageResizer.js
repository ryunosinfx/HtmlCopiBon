export class ImageResizer {
  trimByte(byteX) {
    const x = Math.ceil(byteX);
    const maxByte = x > 255 ?
      255 :
      x;
    const minByte = maxByte < 0 ?
      0 :
      maxByte;
    return maxByte;
  }
  culcWeightByCubic() {
    return (x, alpha) => {
      let result = 0;
      if (x <= 1.0) {
        result = ((alpha + 2.0) * x * x * x) - ((alpha + 3.0) * x * x) + 1;
      } else if (x <= 2.0) {
        result = (alpha * x * x * x) - (5.0 * alpha * x * x) + (8.0 * alpha * x) - (4.0 * alpha);
      }
      return result;
    }
  }
  sincLanczos(x) {
    return Math.sin(x * Math.PI) / (x * Math.PI);
  }

  lanczosWeight() {
    return (d, n = 3) => {
      return d === 0 ?
        1 :
        (
          Math.abs(d) < n ?
          this.sincLanczos(d) * this.sincLanczos(d / n) :
          0);
    }
  }
  resizeInMaxSize(iamegData, maxWidth, maxHeight) {
    const {
      data,
      width,
      height
    } = iamegData;
    const isWidthGreater = (width >= height);
    const retio = isWidthGreater ? maxWidth / width : maxHeight / height;
    const newWidth = isWidthGreater ? maxWidth : width * retio;
    const newHeight = isWidthGreater ? height * retio : maxHeight;
    const newData = new Uint8ClampedArray(this.resizeByCubic(data, width, height, newWidth, newHeight));
    return {
      data: newData,
      width: newWidth,
      height: newHeight
    };
  }
  resizeLanczos(bitmapUint8Array, sourceWidth, sourceHeight, newWidth, newHeight) {
    return this.resize(bitmapUint8Array, sourceWidth, sourceHeight, newWidth, newHeight, this.lanczosWeight(), 6, 3);
  }
  resizeByCubic(bitmapUint8Array, sourceWidth, sourceHeight, newWidth, newHeight) {
    return this.resize(bitmapUint8Array, sourceWidth, sourceHeight, newWidth, newHeight, this.culcWeightByCubic(), 4, -1.0);
  }
  // TODO run with maltiThead
  resize(bitmapUint8Array, sourceWidth, sourceHeight, newWidth, newHeight, weightFunc, size, alpha) {
    const sw = sourceWidth;
    const sw4 = sw * 4;
    const swLimit = sw - 1;
    const sh = sourceHeight;
    const sh4 = sh * 4;
    const shLimit = sh - 1;
    const wf = sw / newWidth;
    const hf = sh / newHeight;
    const src = bitmapUint8Array;
    const dist = new Uint8Array(newWidth * newHeight * 4);
    const sizeHalf = size / 2;
    const xMap = {};
    for (let iy = 0; iy < newHeight; iy++) {
      const wfy = hf * iy;
      const y = Math.ceil(wfy);
      const startY = y - (sizeHalf - 1);
      const endY = y + sizeHalf;
      const y32bitOffsetDist = iy * 4 * newWidth;
      for (let ix = 0; ix < newWidth; ix++) {
        const wfx = wf * ix;
        const x = Math.ceil(wfx);
        let r = 0;
        let g = 0;
        let b = 0;
        const startX = x - (sizeHalf - 1);
        const endX = x + sizeHalf;
        for (let jy = startY; jy <= endY; jy++) {
          const weightY = weightFunc(Math.abs(wfy - jy), alpha);
          const sy = (jy < 0 || jy > shLimit) ?
            y :
            jy;
          const y32bitOffset = sw4 * sy;
          for (let jx = startX; jx <= endX; jx++) {
            const w = weightFunc(Math.abs(wfx - jx), alpha) * weightY;
            if (w === 0) {
              continue;
            }
            const sx = (jx < 0 || jx > swLimit) ?
              x :
              jx;
            const offset32bit = y32bitOffset + sx * 4;
            r += src[offset32bit] * w;
            g += src[offset32bit + 1] * w;
            b += src[offset32bit + 2] * w;
          }
        }
        const offset32bitDist = y32bitOffsetDist + ix * 4;
        dist[offset32bitDist] = this.trimByte(r);
        dist[offset32bitDist + 1] = this.trimByte(g);
        dist[offset32bitDist + 2] = this.trimByte(b);
        dist[offset32bitDist + 3] = 255;
      }
    }
    console.log(dist.buffer);
    return dist.buffer;
  }
}
