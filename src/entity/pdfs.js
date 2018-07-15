import {BaseEntity} from "../service/entity/baseEntity";
export class Pdfs extends BaseEntity{
  constructor() {
    super("Pdfs");
    this.name = null;
    this.binary = null;
    this.type = null;
    this.modifyDate = null;
    this.width = null;
    this.height = null;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }
}
