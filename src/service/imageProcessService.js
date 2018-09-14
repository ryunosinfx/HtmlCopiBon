import {ImageProcessor} from "../util/imageProcessor";
export class ImageProcessService {
  constructor() {
    this.ip = new ImageProcessor();
  }
  async createThumbnail(arrayBuffer,type){
    const retURI = await this.ip.create(arrayBuffer,100,100,type);
    // console.log(retURI);
    return retURI;
  }

  async createImageNodeByData(data) {
    return await this.ip.createImageNodeByData(data);
  }

  async resize(ab, newWidth, newHeight) {
    return await this.ip.resize(ab, newWidth, newHeight);
  }
  async resizeAsPaperB5_72(ab) {
    return await this.ip.resizeAsPaper(ab,"B5", "dpi72", "conbini");
  }
  async getImageDataFromArrayBuffer(ab){
    return await this.ip.getImageDataFromArrayBuffer(ab);
  }
  getArrayBufferFromImageBitmapData(imageBitmapData,option){
    return this.ip.getArrayBufferFromImageBitmapData(imageBitmapData,option);
  }
  getArrayBufferFromImageBitmapDataAsJpg(imageBitmapData,quority) {
    return this.ip.getArrayBufferFromImageBitmapDataAsJpg(imageBitmapData,quority);
  }
  getArrayBufferFromImageBitmapDataAsPng(imageBitmapData) {
    return this.ip.getArrayBufferFromImageBitmapDataAsPng(imageBitmapData);
  }
}
