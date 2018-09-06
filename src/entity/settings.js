import {BaseEntity} from "../service/entity/baseEntity";
const refcols = ['outputProfile']
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
  getRefCols(){
    return refcols;
  }
}
