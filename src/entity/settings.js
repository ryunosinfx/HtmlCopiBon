import {BaseEntity} from "../service/entity/baseEntity";
export class Settings extends BaseEntity{
  constructor() {
    super("Settings");
    this.name = "";
    this.pageNum = 0;
    this.startPage = "l";
    this.pageDelection = 0;
    this.outputProfile = null;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }
}
