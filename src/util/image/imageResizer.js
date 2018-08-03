export class ImageResizer {
  trimByte(byteX) {
    const x = Math.floor(byteX);
    const maxByte = x > 255 ?
      255 :
      x;
    const minByte = maxByte < 0 ?
      0 :
      maxByte;
    return minByte;
  }
  culcWeightByCubic(alpha) {
    return (x) => {
      let result = 0;
      if (x <= 1) {
        result = ((alpha + 2.0) * x * x * x) - ((alpha + 3.0) * x * x) + 1;
      } else if (x <= 2) {
        result = (alpha * x * x * x) - (5.0 * alpha * x * x) + (8.0 * alpha * x) - (4.0 * alpha);
      }
      return result;
    }
  }
  sincLanczos(x) {
    return Math.sin(x * Math.PI) / (x * Math.PI);
  }

  lanczosWeight(n = 3) {
    return (d) => {
      return d === 0 ?
        1 :
        (
          Math.abs(d) < n ?
          this.sincLanczos(d) * this.sincLanczos(d / n) :
          0);
    }
  }
  resize(iamegData, newWidth, newHeight, distImage) {
    const {
      data,
      width,
      height
    } = iamegData;
    const distBitmap = distImage.data;
    const newData = new Uint8ClampedArray(this.resizeLanczos(data, width, height, newWidth, newHeight, distBitmap));
    return distImage
  }
  resizeLanczos(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, distBitmap) {
    return this.resizeExecute(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, this.lanczosWeight(3), 6, distBitmap);
  }
  resizeByCubic(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, distBitmap) {
    return this.resizeExecute(originBitmap, sourceWidth, sourceHeight, newWidth, newHeight, this.culcWeightByCubic(-1.0), 4, distBitmap);
  }
  // TODO run with maltiThead
  resizeExecute(originBitmap, sourceWidth, sourceHeight, newWidthF, newHeightF, weightFunc, size, distBitmap) {
    const newWidth = Math.floor(newWidthF);
    const newHeight = Math.floor(newHeightF);
    const sw = Math.floor(sourceWidth);
    const sw4 = sw * 4;
    const swLimit = sw - 1;
    const sh = Math.floor(sourceHeight);
    const sh4 = sh * 4;
    const shLimit = sh - 1;
    const wf = sw / newWidth;
    const hf = sh / newHeight;
    const src = originBitmap;
    const dist = distBitmap ?
      distBitmap :
      new Uint8Array(newWidth * newHeight * 4);
    const sizeHalf = size / 2;
    const sizeHalfm1 = sizeHalf - 1;
    const xMap = {};
    for (let iy = 0; iy < newHeight; iy++) {
      const wfy = hf * iy;
      const y = Math.floor(wfy);
      const startY = y - sizeHalfm1;
      const endY = y + sizeHalf;
      const y32bitOffsetDist = iy * 4 * newWidth;
      for (let ix = 0; ix < newWidth; ix++) {
        const wfx = wf * ix;
        const x = Math.floor(wfx);
        let r = 0;
        let g = 0;
        let b = 0;
        const startX = x - sizeHalfm1;
        const endX = x + sizeHalf;
        for (let jy = startY; jy <= endY; jy++) {
          const weightY = weightFunc(Math.abs(wfy - jy));
          const sy = (jy < 0 || jy > shLimit) ?
            y :
            jy;
          const y32bitOffset = sw4 * sy;
          for (let jx = startX; jx <= endX; jx++) {
            const w = weightFunc(Math.abs(wfx - jx)) * weightY;
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
        // console.log("newHeight y32bitOffsetDist:"+y32bitOffsetDist);
        const offset32bitDist = y32bitOffsetDist + ix * 4;
        dist[offset32bitDist] = this.trimByte(r);
        dist[offset32bitDist + 1] = this.trimByte(g);
        dist[offset32bitDist + 2] = this.trimByte(b);
        dist[offset32bitDist + 3] = 255;
      }
    }
    console.log("newHeight:" + dist.buffer);
    console.log(dist.buffer);
    return dist.buffer;
  }
}
