import { RefObject } from '../base/refObject.js';
export class ImageResourcesObject extends RefObject {
	constructor(imageId) {
		super();
		this.setElm('ProcSet', ['PDF', 'ImageC']);
		this.imageId = imageId;
	}
	setImageXObject(imageXObject) {
		const xObjectMap = new RefObject();
		xObjectMap.setBePlaneMap();
		const imageId = imageXObject.getImageId();
		xObjectMap.setElm(imageId, imageXObject);
		imageXObject.registerRefMap();
		this.setElm('XObject', xObjectMap);
	}
}
