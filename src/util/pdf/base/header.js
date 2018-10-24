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
		const retText = '%PDF-1.7' + NEW_LINE + '%';
	}
	static getU8a() {
		const u8aMain = UnicodeEncoder.encodeUTF8(Header.getText());
		const binStrU8a = BinaryUtil.hexString2U8a('\xe2\xe3\xcf\xd3');
		const u8aNewLine = UnicodeEncoder.encodeUTF8(NEW_LINE);
		return BinaryUtil.joinU8as([u8aMain, binStrU8a, u8aNewLine]);
	}
}