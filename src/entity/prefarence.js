import {BaseEntity} from "../service/entity/baseEntity";
const refcols = ['outputProfile']
export class Prefarence extends BaseEntity{
  constructor() {
    super("Prefarence");
    this.threadsNum = 4;
    this.createDate = Date.now();
    this.updateDate = Date.now();
    this.listing = 0;
  }
  getRefCols(){
    return refcols;
  }
}
