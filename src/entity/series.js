import {BaseEntity} from "../service/entity/baseEntity";
export class Series extends BaseEntity{
  constructor(name) {
    super();
    this.name=name;
    this.target=null;
    this.no="";
    this.date="";
    this.pageNo=0;
  }
}
