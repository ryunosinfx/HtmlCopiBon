import { BaseEntity } from "../service/entity/baseEntity";
const refcols = ['target']
export class Series extends BaseEntity {
	constructor(name) {
		super("Series");
		this.name = name;
		this.target = null;
		this.no = "";
		this.date = "";
		this.pageNo = 0;
	}
	getRefCols() {
		return refcols;
	}
}