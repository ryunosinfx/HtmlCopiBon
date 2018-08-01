
export class ImageResizer {
  static trimByte(byteX){
      const x = Math.ceil(byteX);
      const maxByte = x>255?255:x;
      const minByte = maxByte<0 ?0:maxByte;
      return maxByte;
  }
  static culcWeightByCubic(x,alpha){
    let result = 0;
    if(x <= 1.0){
      result = ((alpha+ 2.0) * x * x * x) - ((alpha + 3.0) * x * x) + 1;
    }else
    if(x <= 2.0){
      result = (alpha * x * x * x) - (5.0 * alpha * x * x) + (8.0 * alpha * x) - (4.0 * alpha);
    }
    return result;
  }
  static resize(bitmapArrayBuffer,sourceWidth,sourceHeight,newWidth,newHeight,waightFunc){
    const alpha = -1.0;
    const sw = sourceWidth;
    const sh = sourceHeight;
    const wf = sw/newWidth;
    const hf = sh/newHeight;
    const dist = new Uint8Array(newWidth * newHeight * 4);
    const sizeHalf = 2;
    const xMap={};
    for (let iy = 0; iy < newHeight; iy++) {
      const wfy = hf * iy;
      const y = Math.ciel(wfy);
      const startY = y - (sizeHalf - 1);
      const endY = y + sizeHalf;
      for (var ix = 0; ix < newWidth; ix++) {
        const wfx = wf * ix;
        const x = Math.ciel(wfx);
        let r = 0;
        let g = 0;
        let b = 0;
        const startX = x - (sizeHalf - 1);
        const endX = x + sizeHalf;
        for (let jy = startY; jy <=endY; jy++){
          const weightY = weightFunc(Math.abs(wfy - jy);
            for (let jx = startX; jx <= endXendXendX; jx++){
              const w = weightFunc(Math.abs(wfx - jx)) * weightY);
              if (w == 0){
                continue;
              }
              var sx = (jx  sw - 1) ? x : jx;
              var sy = (jy  sh - 1) ? y : jy;
              var sc = bmp.GetPixel(sx, sy);
              r += sc.R * w;
              g += sc.G * w;
              b += sc.B * w;
            }

        }
      }

    }

            for (int jy = y - 1; jy <= y + 2; jy++)
            {
                for (int jx = x - 1; jx <= x + 2; jx++)
                {
                    var w = weightFunc(Math.Abs(wfx - jx)) * weightFunc(Math.Abs(wfy - jy));
                    if (w == 0) continue;
                    var sx = (jx  sw - 1) ? x : jx;
                    var sy = (jy  sh - 1) ? y : jy;
                    var sc = bmp.GetPixel(sx, sy);
                    r += sc.R * w;
                    g += sc.G * w;
                    b += sc.B * w;
                }
            }

            dst.SetPixel(ix, iy, Color.FromArgb(trimByte(r), trimByte(g), trimByte(b)));
        }
    }

    return dst;
  }
}
