import {BaseEntity} from "../service/entity/baseEntity";
export class Pages extends BaseEntity{
  constructor() {
    super("Pages");
    this.previewThumbnail = null;
    this.outputImage = null;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }
}
