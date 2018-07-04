import {BaseEntity} from "../service/entity/baseEntity";
export class Pages extends BaseEntity{
  constructor() {
    super();
    this.image = null;
    this.isDummy = true;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }
}
