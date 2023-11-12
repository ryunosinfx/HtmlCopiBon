import { RefObject } from '../base/refObject.js';
export class ContentsObject extends RefObject {
	constructor() {
		super();
		this.setElm('Type', 'Pages');
	}
	setParentPage(pageObj) {
		this.pageObj = pageObj;
		this.pageWidth = this.pageObj.width;
		this.pageHeight = this.pageObj.height;
	}
	setText(text, offsetX, offsetY) {}
}
