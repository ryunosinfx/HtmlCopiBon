import { pageSazeMap } from '../constants/pdfConstants.js';
import { RefObject } from '../base/refObject.js';
export class PageObject extends RefObject {
	constructor(sizeName = 'A4') {
		super();
		this.setElm('Type', 'Page');
		const paperSizePoint = pageSazeMap[sizeName];
		this.width = paperSizePoint[2];
		this.height = paperSizePoint[3];
		// console.log(pageSazeMap)
		// console.log(paperSizePoint)
		// alert(pageSazeMap + "/this.width+:" + this.width + "/this.height:" + this.height)
		this.setElm('MediaBox', paperSizePoint);
	}
	setParent(parent) {
		this.setElm('Parent', parent);
	}
	setResources(resources) {
		this.setElm('Resources', resources);
		resources.registerRefMap();
	}
	setContents(contents) {
		if (contents.setParentPage) {
			contents.setParentPage(this);
		}
		this.setElm('Contents', contents);
		contents.registerRefMap();
	}
	getFontName() {
		return this.fontName;
	}
}
