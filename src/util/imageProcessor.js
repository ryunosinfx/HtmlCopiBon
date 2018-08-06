import vu from "./viewUtil";
import bc from "./binaryConverter";
import {ImageResizer} from "./image/imageResizer";
const imgRe = /^image\/.+|application\/octet-stream/;
export class ImageProcessor {
  constructor() {
    this.canvas = vu.createCanvas(null, "hidden");

    this.ctx = this.canvas.getContext('2d');
    this.imageResizer = new ImageResizer();
    window.onload = () => {
      document.body.appendChild(this.canvas);
    };
  }
  setDataURI(dataURI) {
    this.dataURI = dataURI;
  }

  async resize(ab, maxWidth, maxHeight) {
    const origin = await this.getImageDataFromArrayBuffer(ab);
    return this.resizeInMaxSize(origin, maxWidth, maxHeight);
  }

  resizeInMaxSize(iamegData, maxWidth, maxHeight) {
    const {data, width, height} = iamegData;
    const isWidthGreater = (width >= height);
    const retio = isWidthGreater
      ? maxWidth / width
      : maxHeight / height;
    const newWidth = isWidthGreater
      ? maxWidth
      : width * retio;
    const newHeight = isWidthGreater
      ? height * retio
      : maxHeight;
    return this.resizeExecute(iamegData, newWidth, newHeight);
  }
  resizeExecute(iamegData, newWidth, newHeight) {
    console.time('resize');
    let newImageData = this.ctx.createImageData(newWidth, newHeight);
    const newData = new Uint8ClampedArray(this.imageResizer.resize(iamegData, newWidth, newHeight, newImageData));
    this.canvas.width = newImageData.width;
    this.canvas.height = newImageData.height;
    this.ctx.putImageData(newImageData, 0, 0);
    newImageData = undefined;
    let dataUri = this.canvas.toDataURL();
    console.timeEnd('resize');
      console.time('resize copy');
    const abResized = bc.dataURI2ArrayBuffer(dataUri);
    dataUri = undefined;
    console.timeEnd('resize copy');
    return abResized;
  }
  getImageDataFromArrayBuffer(ab) {
    console.time('resize getImageDataFromArrayBuffer');
    return new Promise((resolve, reject) => {
      let dataUri = bc.arrayBuffer2DataURI(ab);
      ab = null;
      const img = new Image();
      img.src = dataUri;
      img.onload = () => {
        dataUri = null
        const width = img.width;
        const height = img.height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.drawImage(img, 0, 0);
        const imageData = this.ctx.getImageData(0, 0, width, height);
        resolve(imageData);
        console.timeEnd('resize getImageDataFromArrayBuffer');
      }
      img.onerror = (e) => {
        reject(e);
      }
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
        this.canvas.height = Math.floor(imgElm.height * scale);
        this.canvas.width = Math.floor(imgElm.width * scale);
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
