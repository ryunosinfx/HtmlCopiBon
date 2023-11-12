import { BinaryUtil } from '../util/binaryUtil.js';
import { RefObject } from '../base/refObject.js';
const CRLF = '\r\n';
export class TrailerObject extends RefObject {
	constructor() {
		super();
	}
	setRoot(rootObj) {
		rootObj.registerRefMap();
	}
	setInfo(infoObj) {
		infoObj.registerRefMap();
	}
	createXref(startOffset) {
		const NEWLINE = RefObject.getNewLine();
		let retText = 'xref' + NEWLINE;
		const list = RefObject.getRefList();
		const len = list.length;
		retText += '0 ' + len + NEWLINE;
		const results = [];
		let rootObj = null;
		let infoObj = null;
		retText += '0000000000 65535 f' + CRLF;
		let currentBytes = startOffset;
		for (let i = 0; i < len; i++) {
			const refObje = list[i];
			const u8a = refObje.createObject();
			retText += ('0000000000' + currentBytes).slice(-10) + ' 00000 n' + CRLF;
			currentBytes += u8a.length;
			results.push(u8a);
			if (refObje.isRoot) {
				rootObj = refObje;
			}
			if (refObje.isInfo) {
				infoObj = refObje;
			}
		}
		retText += 'trailer' + NEWLINE;
		retText += '<<' + NEWLINE;
		retText += '/Root ' + rootObj.getRefNo() + 'R' + NEWLINE;
		if (infoObj) {
			retText += '/Info ' + infoObj.getRefNo() + 'R' + NEWLINE;
		}
		retText += '/Size ' + len + NEWLINE;
		retText += '>>' + NEWLINE;
		retText += 'startxref' + NEWLINE;
		retText += currentBytes + NEWLINE;
		retText += '%%EOF';
		const trailerU8a = RefObject.getAsU8a(retText);
		results.push(trailerU8a);
		// <<
		// /Root 1 0 R
		// /Size 6
		// >>
		// startxref
		// 440
		// %%EOF
		return BinaryUtil.joinU8as(results);
	}
}
