import vu from "./viewUtil";
import bc from "./binaryConverter";
const imgRe = /^image\/.+/;
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
        const scale = widthScale <= heightScale ?
          widthScale :
          heightScale;
        this.canvas.height = imgElm.height * scale;
        this.canvas.width = imgElm.width * scale;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.scale(scale, scale);
        this.ctx.drawImage(imgElm, 0, 0);
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

  createImageNodeByData(data) {
    return new Promise((resolve, reject) => {
      let {
        name,
        ab,
        type
      } = data;
      let imgElm = vu.createImage();
      imgElm.alt = escape(name);

      console.log("createImageNodeByData A00data!" + data + "/ab.byteLength:" + ab.byteLength)
      console.log(data)
      if (type && type.match(imgRe)) {
        imgElm.src = bc.arrayBuffer2DataURI(ab, type);
        imgElm.onload = () => {
          data.height = imgElm.height;
          data.width = imgElm.width;
          console.log("createImageNodeByData A01 imgElm!" + type)
          resolve(imgElm);
        }
        imgElm.onerror = (e) => {
          console.log('失敗');
          console.log(e);
          reject(e);
        };
        return
      } else {
        console.log("createImageNodeByData A02 imgElm!" + type)
        resolve(imgElm);
      }

    });
  }
}
