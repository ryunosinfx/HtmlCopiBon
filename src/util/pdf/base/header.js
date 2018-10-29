import {
	BinaryUtil
} from '../util/binaryUtil'
import {
	RefObject
} from './refObject'
import {
	UnicodeEncoder
} from '../util/unicodeEncoder'
const NEW_LINE = RefObject.getNewLine();
export class Header {
	static getText() {
		const retText = '%PDF-1.４' + NEW_LINE + '%';
		return retText;
	}
	static getU8a() {
		const u8aMain = UnicodeEncoder.encodeUTF8(Header.getText());
		const binStrU8a = BinaryUtil.hexString2U8a('e2,e3,cf,d3');
		const u8aNewLine = UnicodeEncoder.encodeUTF8(NEW_LINE);
		return BinaryUtil.joinU8as([u8aMain, binStrU8a, u8aNewLine]);
	}
}