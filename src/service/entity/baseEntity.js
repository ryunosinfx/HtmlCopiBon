import ObjectUtil from "../../util/objectUtil";
export default class BaseEntity {
  constructor(pk="oid") {
    this.pk = pk;
    this.refs=[];
  }
  isEntitiy(){
    return true;
  }
  getEntityName() {
    return this.constructor.name;
  }
  create(){

  }
  update(){

  }
  setPk(pkValue){
    return this[this.pk]=pkValue;
  }
  getPk(){
    return this.pk;
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
  toObj(refId){
    let cloned = ObjectUtil.singleDeepCloneWithoutFuncs(this);
    this.exclude(cloned);
    return cloned;
  }
}
