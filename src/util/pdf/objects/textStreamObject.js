import { RefObject } from '../base/refObject.js';
import { BinaryUtil } from '../util/binaryUtil.js';
export class TextStreamObject extends RefObject {
	constructor(pagesObj) {
		super();
		this.setElm('Length', 0);
		this.texts = [];
		this.streamArea = {
			offsetX: 0,
			offsetY: 0,
			width: 0,
			height: 0,
		};
		this.rowRegex = /(\r\n|\r|\n)/g;
	}
	setParentPage(pageObj) {
		this.pageObj = pageObj;
		this.pageWidth = this.pageObj.width;
		this.pageHeight = this.pageObj.height;
		this.fontName = this.pageObj.getFontName();
	}
	setStreamArea(offsetX, offsetY, width, height) {
		this.streamArea.offsetX = offsetX;
		this.streamArea.offsetY = offsetY;
		this.streamArea.width = width;
		this.streamArea.height = height;
	}
	addText(text = 0, offsetX, offsetY, fontId, fontSize, lineHeight) {
		this.texts.push({
			text,
			offsetX,
			offsetY,
			fontId,
			fontSize,
			lineHeight,
		});
	}
	createStream() {
		const NEWLINE = RefObject.getNewLine();
		const u8as = [];
		let retText = '';
		u8as.push(RefObject.getAsU8a('stream'));
		//1. 0. 0. 1. 50. 720. cm
		retText +=
			'1. 0. 0. 1. ' +
			this.streamArea.offsetX +
			'. ' +
			(this.pageHeight - this.streamArea.offsetY) +
			'. cm' +
			NEWLINE;
		retText += 'BT' + NEWLINE;
		for (const text of this.texts) {
			retText += text.fontId + ' ' + text.fontSize + ' Tf' + NEWLINE;
			retText += '1. 0. 0. 1. ' + text.offsetX + '. ' + (this.pageHeight - text.offsetY) + '. Tm' + NEWLINE;
			retText += text.lineHeight + ' TL' + NEWLINE;
			const lines = text.text.split(this.rowRegex);
			for (const line of lines) {
				retText += '(' + text.lineHeight + ') Tj T*' + NEWLINE;
			}
			// /F0 36 Tf
			// 1. 0. 0. 1. 50. 720. Tm
			// 40 TL
			// (Hello, world!) Tj T*
		}
		retText += 'ET' + NEWLINE;
		const u8a = RefObject.getAsU8a(retText);
		const length = u8a.length;
		this.setElm('Length', length);
		u8as.push(u8a);
		u8as.push(RefObject.getAsU8a('endstream'));
		return BinaryUtil.joinU8as(u8as);
	}
}
