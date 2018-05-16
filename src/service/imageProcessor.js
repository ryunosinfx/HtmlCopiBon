import vu from "../util/viewUtil";
import bc from "../util/binaryConverter";
export default class ImageProcessor {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }
  setDataURI(dataURI) {
    this.dataURI = dataURI;
  }
  create(arrayBuffer, width, height, type) {
    const imgElm = new Image();
    img.src = bc.arrayBuffer2DataURI(arrayBuffer, type);

    imgElm.onload = () => {
      this.canvas.height = imgElm.height;
      this.canvas.width = imgElm.width;
      ctx.drawImage(imgElm, 0, 0);
    };

    imgElm.onerror = () => {
      console.log('失敗');
    };
  }
  exportPng() {
    return this.canvas.toDataURL();
  }
  exportJpeg(quority = 1.0) {
    return this.canvas.toDataURL('image/jpeg', quority);
  }
}
