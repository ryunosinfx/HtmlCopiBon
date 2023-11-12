import { BaseEntity } from '../service/entity/baseEntity.js';
const refcols = ['previewThumbnail', 'outputImage', 'outputExpandImage', 'outputDualImage', 'thumbnail', 'baseImage'];
export class Pages extends BaseEntity {
	constructor() {
		super('Pages');
		this.previewThumbnail = null;
		this.outputImage = null;
		this.outputExpandImage = null;
		this.outputDualImage = null;
		this.thumbnail = null;
		this.baseImage = null;
		this.isForceColor = false;
		this.isNoCropping = false;
		this.createDate = Date.now();
		this.updateDate = Date.now();
		this.listing = 0;
	}
	getRefCols() {
		return refcols;
	}
}
