import vu from "./viewUtil";
import bc from "./binaryConverter";
export class ImageProcessor {
  constructor() {
    this.canvas = vu.createCanvas(null, "hidden");
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }
  setDataURI(dataURI) {
    this.dataURI = dataURI;
  }
  create(arrayBuffer, width, height, type) {
    return new Promise((resolve, reject) => {
      const imgElm = new Image();
      imgElm.src = bc.arrayBuffer2DataURI(arrayBuffer, type);
      imgElm.onload = () => {
        const widthScale = width / imgElm.width;
        const heightScale = height / imgElm.height;
        const scale = widthScale <= heightScale
          ? widthScale
          : heightScale;
        this.canvas.height = imgElm.height * scale;
        this.canvas.width = imgElm.width * scale;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.scale(scale, scale);
        this.ctx.drawImage(imgElm, 0, 0);
        //this.ctx.scale(1/scale, 1/scale);
        // console.log(imgElm.src);
        // console.log(scale);
        resolve(this.exportPng());
      };
      imgElm.onerror = (e) => {
        console.log('失敗');
        console.log(e);
        reject(null);
      };
    });
  }
  exportPng() {
    return this.canvas.toDataURL();
  }
  exportJpeg(quority = 1.0) {
    return this.canvas.toDataURL('image/jpeg', quority);
  }
}
