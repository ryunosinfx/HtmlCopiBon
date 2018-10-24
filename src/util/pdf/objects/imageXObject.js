import {
	RefObject
} from '../base/refObject'
import {
	BinaryUtil
} from '../util/binaryUtil'
import {
	UnicodeEncoder
} from '../util/unicodeEncoder'
export class ImageXObject extends RefObject {
	constructor(imageId, jpegDataUri, width, height) {
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
		this.jpegDataUri = jpegDataUri;
	}
	getImageId() {
		return this.imageId;
	}
	createStream() {
		const NEWLINE = RefObject.getNewLine();
		const u8as = [];
		const retText = ''
		u8as.push(RefObject.getAsU8a('stream'));
		const jpegU8a = BinaryUtil.convertDataUri2U8a(this.jpegDataUri);
		const length = jpegU8a.length;
		this.setElm('Length', length);
		u8as.push(jpegU8a);
		u8as.push(RefObject.getAsU8a('endstream'));
		return BinaryUtil.joinU8as(u8as);
	}
}