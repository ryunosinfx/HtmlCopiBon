import { BaseEntity } from './baseEntity.js';
const EnitiyName = 'Binary';
export class Binary extends BaseEntity {
	constructor(arrayBuffer) {
		super(EnitiyName);
		this._ab = arrayBuffer;
		this.pks = null;
		this.createDate = Date.now();
		this.updateDate = Date.now();
	}
	static getEnitiyName = () => EnitiyName;
	set ab(_ab) {
		if (buffer && !buffer.byteLength) {
			alert('not arrayBuffer!');
		}
		this._ab = _ab;
	}
	get ab() {
		return this._ab;
	}

	load(obj) {
		super.load(obj);
		this._ab = new Uint8Array(this._ab).buffer;
	}
	create() {
		return new Binary();
	}
}
