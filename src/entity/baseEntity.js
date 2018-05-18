import ObjectUtil from "../util/objectUtil";
xport default class BaseEntity {
  constructor() {
  }
  create(){

  }
  update(){

  }
  include(obj){

  }
  exclude(obj){

  }
  async deepClone(){
    return await ObjectUtil.deepClone(this);
  }
  load(obj){
    for(let key in obj){
      this[key] = obj[key];
    }
  }
  toObj(){
    let cloned = ObjectUtil.singleDeepCloneWithoutFuncs(this);
    this.exclude(cloned);
    return cloned;
  }
}
