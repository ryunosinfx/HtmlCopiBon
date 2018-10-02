import { ImageMerger } from "./imageMerger";
export class ImageCropper {
	constructor() {
		this.imageMerger = new ImageMerger();
	}

	async cropImage(imageData, newWidth, newHieght, offsetX, offsetY) {
		const retArray = new Uint8ClampedArray(newWidth * newHieght * 4);
		const imagaDataBase = {
			data: retArray,
			width: newWidth,
			height: newHieght
		};
		imageData.offsetX = offsetX;
		imageData.offsetY = offsetY;
		await this.imageMerger.maegeReplace(imagaDataBase, [imageData], false)
		return imagaDataBase;
	}
	async corpImageToData(imageData, distData, offset) {
		imageData.offsetX = offset.x;
		imageData.offsetY = offset.y;
		await this.imageMerger.maegeReplace(distData, [imageData], false);
	}
}