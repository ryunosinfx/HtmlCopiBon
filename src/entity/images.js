import BaseEntity from "./baseEntity";
export default class Images extends BaseEntity {
  constructor() {
    super();
    this.name = null;
    this.ab = null;
    this.type = null;
    this.modifyDate = null;
    this.thunbnail = null;
    this.width = null;
    this.height = null;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }

  include(obj){
    this.thunbnail = obj;
  }

  exclude(obj){
    obj.thunbnail = null;
  }
}
