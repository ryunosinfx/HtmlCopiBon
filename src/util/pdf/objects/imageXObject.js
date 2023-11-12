import { RefObject } from '../base/refObject.js';
import { BinaryUtil } from '../util/binaryUtil.js';
export class ImageXObject extends RefObject {
	constructor(imageId, u8a, width, height) {
		super();
		this.setElm('Type', 'XObject');
		this.setElm('Subtype', 'Image');
		this.setElm('Width', width);
		this.setElm('Height', height);
		this.setElm('BitsPerComponent', 8);
		this.setElm('Length', 0);
		this.setElm('ColorSpace', 'DeviceRGB');
		this.setElm('Filter', 'DCTDecode');
		this.imageId = imageId;
		console.log('ImageXObject.constructor u8a:' + u8a.byteLength);
		this.jpegU8a = u8a;
	}
	getImageId() {
		return this.imageId;
	}
	createStream() {
		const NEWLINE = RefObject.getNewLine();
		const u8as = [];
		u8as.push(RefObject.getAsU8a('stream'));
		const length = this.jpegU8a.byteLength;
		this.setElm('Length', length);
		u8as.push(this.jpegU8a);
		u8as.push(RefObject.getAsU8a(NEWLINE + 'endstream'));
		console.log('ImageXObject.createStream this.jpegU8a:' + this.jpegU8a.byteLength);
		const result = BinaryUtil.joinU8as(u8as);
		console.log('ImageXObject.createStream result:' + result.byteLength);
		return result;
	}
}
