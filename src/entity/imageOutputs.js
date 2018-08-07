import {BaseEntity} from "../service/entity/baseEntity";
export class ImageOutputs extends BaseEntity {
  constructor() {
    super("ImageOutputs");
    this.name = null;
    this.binary = null;
    this.type = null;// zip or pdf
    this.thumbnail = null;// thumnails of firstPage
    this.modifyDate=null;
    this.width = null;
    this.height = null;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }
}
