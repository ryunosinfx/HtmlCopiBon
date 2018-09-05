import {BaseEntity} from "../service/entity/baseEntity";
const refcols = ['binary','thumbnail']
export class ImageOutputs extends BaseEntity {
  constructor() {
    super("ImageOutputs");
    this.name = null;
    this.binary = null;
    this.type = null; // zip or pdf
    this.thumbnail = null; // thumnails of firstPage
    this.orderName = "";
    this.size = 0;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }
  getfCols(){
    return refcols;
  }
}
