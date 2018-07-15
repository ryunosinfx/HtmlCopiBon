import {BaseEntity} from "../service/entity/baseEntity";
export class OutputProfiles extends BaseEntity {
  constructor(id, prefix, name) {
    super("OutputProfiles");
    //console.log("!=!titleId:"+titleId+"!=!titleId:"+titleId+"!=!name:"+name+"!=!"+Date.now());
    this.id = id;
    this.prefix = prefix;
    this.pageSize = "A5";
    this.direction = "r2l";
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
    //console.log(this);
  }

}
