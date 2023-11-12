import { BaseEntity } from '../service/entity/baseEntity.js';
const refcols = ['images', 'setting', 'series', 'pages', 'outputsPars', 'exports'];
export class Title extends BaseEntity {
	constructor(titleId, titlePrefix, name) {
		super('Title');
		//console.log("!=!titleId:"+titleId+"!=!titleId:"+titleId+"!=!name:"+name+"!=!"+Date.now());
		this.id = titleId;
		this.prefix = titlePrefix;
		this.name = name;
		this.target = '';
		this.no = '';
		this.date = '';
		this.pageNo = 0;
		this.setting = null;
		this.series = null;
		this.pageNum = -1;
		this.images = [];
		this.pages = [];
		this.outputsPars = [];
		this.exports = [];
		this.direction = 'r2l';
		this.createDate = Date.now();
		this.updateDate = Date.now();
		this.listing = 0;
		//console.log(this);
	}
	getRefCols() {
		return refcols;
	}
}
