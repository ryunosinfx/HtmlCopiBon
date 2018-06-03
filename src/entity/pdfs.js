import {BaseEntity} from "../service/entity/baseEntity";
export default class Pdfs extends BaseEntity{
  constructor() {
    super();
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
