import { BaseEntity } from '../service/entity/baseEntity.js';
const refcols = ['binary'];
export class Thumbnales extends BaseEntity {
	constructor() {
		super('Thumbnales');
		this.name = null;
		this.binary = null;
		this.type = null;
		this.width = null;
		this.height = null;
		this.createDate = Date.now();
		this.updateDate = Date.now();
		this.listing = 0;
	}
	getRefCols() {
		return refcols;
	}
}
