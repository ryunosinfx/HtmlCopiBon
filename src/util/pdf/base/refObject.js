import {
	BinaryUtil
} from '../util/binaryUtil'
import {
	UnicodeEncoder
} from '../util/unicodeEncoder'
import {
	KeyKeywords
} from '../constants/pdfConstants'
const refMap = new Map();
const NEWLINE = '\n';
const refList = [];
export class RefObject {
	constructor() {
		this.exportText = '';
		this.map = {};
		this.isBePlaneMap = false;
		this.afterRegsterRefMap = [];
		this.isRoot = false;
		this.isInfo = false;
	}
	createExport() {

	}
	static getRefMap() {
		return refMap;
	}
	static getRefList() {
		return refList;
	}
	registerAfterRefMap(obj) {
		this.afterRegsterRefMap.push(obj);
	}
	registerRefMap() {
		refList.push(this);
		let index = 1;
		for (let obj of refList) {
			const indexPrefix = index + " 0 ";
			refMap.set(obj, indexPrefix);
			index++;
		}
		for (let obj of this.afterRegsterRefMap) {
			obj.registerRefMap();
		}
	}
	getRefNo() {
		return refMap.get(this);
	}
	isRegisterd() {
		return refMap.has(this);
	}
	setBePlaneMap() {
		this.isBePlaneMap = true;
	}
	setElm(key, value) {
		this.map[key] = value;
	}
	static getNewLine() {
		return NEWLINE;
	}
	createFile() {}
	static getAsU8a(text) {
		return UnicodeEncoder.encodeUTF8(text + NEWLINE);
	}
	createObject() {
		const u8aStream = this.createStream(this.map);
		const u8aStart = UnicodeEncoder.encodeUTF8(this.getRefNo() + 'obj' + NEWLINE);
		const u8aMain = UnicodeEncoder.encodeUTF8(this.createMap("", this.map));
		const u8aEnd = UnicodeEncoder.encodeUTF8('endobj' + NEWLINE);
		return BinaryUtil.joinU8as([u8aStart, u8aMain, u8aStream, u8aEnd]);
	}
	createMap(keyword, value) {
		let retText = '';
		if (value === null || value === undefined) {

		} else if (typeof value === 'string') {
			if (KeyKeywords[keyword]) {
				retText += "/" + value;
			} else {
				retText += "(" + value + ')';
			}
		} else if (typeof value === 'number') {
			retText += value;
		} else if (typeof value === 'object' && Array.isArray(value)) {
			const newArray = [];
			for (let index in value) {
				const val = value[index];
				newArray.push(this.createMap(keyword, val));
			}
			retText += '[ ' + newArray.join(' ') + ' ]';
		} else if (typeof value === 'object' && value.isRegisterd && value.isRegisterd()) {
			retText += value.getRefNo() + 'R';
		} else if (typeof value === 'object' && value.isRegisterd && value.map) {
			retText += '<<' + NEWLINE
			for (let key in value.map) {
				const val = value.map[key]
				const row = '/' + key + ' ' + this.createMap(key, val);
				retText += row + NEWLINE;
			}
			retText += '>>';
		} else if (typeof value === 'object') {
			retText += '<<' + NEWLINE
			for (let key in value) {
				const val = value[key]
				const row = '/' + key + ' ' + this.createMap(key, val);
				retText += row + NEWLINE;
			}
			retText += '>>' + NEWLINE;
		}
		return retText;
	}
	createStream() {
		return UnicodeEncoder.encodeUTF8('');
	}
}