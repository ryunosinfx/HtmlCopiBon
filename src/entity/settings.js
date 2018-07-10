import {BaseEntity} from "../service/entity/baseEntity";
export class Settings extends BaseEntity{
  constructor() {
    super();
    this.name = "";
    this.pageNum = 0;
    this.startPage = 0;
    this.outputProfile = null;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }
}
