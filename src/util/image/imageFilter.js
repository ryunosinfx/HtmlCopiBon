import { ByteUtil } from './byteUtil.js';
export class ImageFilter {
	constructor() {}

	beGrascale(imageData) {
		const data = imageData.data;
		const width = imageData.width;
		const height = imageData.height;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = (y * width + x) * 4;
				const gray = ByteUtil.trimByte((data[index] + data[index + 1] + data[index + 2]) / 3);
				data[index] = gray;
				data[index + 1] = gray;
				data[index + 2] = gray;
			}
		}
		return imageData;
	}
}
