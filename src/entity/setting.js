import {BaseEntity} from "../service/entity/baseEntity";
export default class Setting extends BaseEntity{
  constructor() {
    super();
    this.pageNum = 0;
    this.startPage = 0;
    this.OutputProfile = null;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }
}
