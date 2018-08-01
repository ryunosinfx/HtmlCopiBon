import vu from "./viewUtil";
import bc from "./binaryConverter";
const imgRe = /^image\/.+|application\/octet-stream/;
export class ImageProcessor {
  constructor() {
    this.canvas = vu.createCanvas(null, "hidden");
    this.ctx = this.canvas.getContext('2d');
    const self = this;
    window.onload = () => {
      document.body.appendChild(this.canvas);
    };
  }
  setDataURI(dataURI) {
    this.dataURI = dataURI;
  }
  getImageDataFromArrayBuffer(ab) {
    return new Promise((resolve, reject) => {
      const dataUri = bc.arrayBuffer2DataURI(ab);
      const img = new Image();
      img.src = dataUri;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.drawImage(img, 0, 0);
        const imageData = this.ctx.getImageData(0, 0, width, height);
        resolve(imageData);
      }
      img.onerror = (e) => {
        reject(e);
      }
    });
  }
  getArrayBufferFromPixcelData(imageData) {
    return new Promise((resolve, reject) => {
      const width = imageData.width;
      const height = imageData.height;
      this.canvas.width = width;
      this.canvas.height = height;
      const newImageData = this.ctx.createImageData(width, height);
      newImageData.data = imageData.data;
      this.ctx.putImageData(newImageData, 0, 0);
      
    });
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
      let {name, ab, type} = data;
      let imgElm = vu.createImage();
      imgElm.alt = escape(name);

      if (!type) {
        type = "application/octet-stream";
      }
      if (type && type.match(imgRe)) {
        imgElm.src = bc.arrayBuffer2DataURI(ab, type);
        imgElm.onload = () => {
          data.height = imgElm.height;
          data.width = imgElm.width;
          resolve(imgElm);
        }
        imgElm.onerror = (e) => {
          console.log('失敗');
          console.log(e);
          reject(e);
        };
        return
      } else {
        resolve(imgElm);
      }

    });
  }
}
