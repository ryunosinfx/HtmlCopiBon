import { RefObject } from '../base/refObject.js';
export class FontObject extends RefObject {
	constructor() {
		super();
	}
	setFont(id, fontName, subType) {
		const fontObj = new RefObject();
		fontObj.setBePlaneMap();
		const fontDetailObj = new RefObject();
		fontDetailObj.setBePlaneMap();
		this.setElm('Font', fontObj);
		fontObj.setElm(id, fontDetailObj);
		fontDetailObj.setElm('Type', 'Font');
		fontDetailObj.setElm('Subtype', subType);
		fontDetailObj.setElm('BaseFont', fontName);
	}
}
