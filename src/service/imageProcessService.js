import {ImageProcessor} from "../util/imageProcessor";
export class ImageProcessService {
  constructor() {
    this.ip = new ImageProcessor();
  }
  async createThumbnail(arrayBuffer,type){
    const retURI = await this.ip.create(arrayBuffer,100,100,type);
    console.log(retURI);
    return retURI;
  }

  async createImageNodeByData(data) {
    return await this.ip.createImageNodeByData(data);
  }

  async getImageDataFromArrayBuffer(data) {
    return await this.ip.getImageDataFromArrayBuffer(data);
  }

  getArrayBufferFromPixcelData(data) {
    return this.ip.getArrayBufferFromPixcelData(data);
  }
}
