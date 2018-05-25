import BaseEntity from "../service/entity/baseEntity";
export default class Title extends BaseEntity {
  constructor(titleId, titlePrefix, name) {
    super();
    this.id = titleId;
    this.prefix = titlePrefix;
    this.name = name;
    this.target = "";
    this.no = "";
    this.date = "";
    this.pageNo = 0;
    this.series = null;
    this.pageNum = -1;
    this.images = [];
    this.direction = "r2l";
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }

}
