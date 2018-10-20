import { ImageProcessor } from "../util/imageProcessor";
export class ImageProcessService {
	constructor() {
		this.ip = new ImageProcessor();
	}
	async createThumbnail(arrayBuffer, type) {
		const retURI = await this.ip.create(arrayBuffer, 100, 100, type);
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
		return await this.ip.resizeAsPaper(ab, "B5", "dpi72", "conbini");
	}
	async getImageDataFromArrayBuffer(ab) {
		return await this.ip.getImageDataFromArrayBuffer(ab);
	}
	getArrayBufferFromImageBitmapData(imageBitmapData, option) {
		console.time("ImageProcessService.getArrayBuffer From ImageBitmapData")
		const result = this.ip.getArrayBufferFromImageBitmapData(imageBitmapData, option);
		console.timeEnd("ImageProcessService.getArrayBuffer From ImageBitmapData")
		return result;
	}
	getArrayBufferFromImageBitmapDataAsJpg(imageBitmapData, quority) {
		console.time("ImageProcessService.getArrayBufferFromImageBitmapDataAsJpg")
		const result = this.ip.getArrayBufferFromImageBitmapDataAsJpg(imageBitmapData, quority);
		console.timeEnd("ImageProcessService.getArrayBufferFromImageBitmapDataAsJpg")
		return result;
	}
	getArrayBufferFromImageBitmapDataAsPng(imageBitmapData) {
		return this.ip.getArrayBufferFromImageBitmapDataAsPng(imageBitmapData);
	}
}