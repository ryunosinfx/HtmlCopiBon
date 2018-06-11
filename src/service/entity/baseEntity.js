import {ObjectUtil} from "../../util/objectUtil";
export class BaseEntity {
  constructor(pk = "oid") {
    this.pk = pk;
    this.refs = [];
  }
  isEntitiy() {
    return true;
  }
  getEntityName() {
    return this.constructor.name;
  }
  create() {}
  update() {}
  setPk(pkValue) {
    return this[this.pk] = pkValue;
  }
  getPk() {
    return this[this.pk];
  }
  include(obj) {
    console.log("!=======BaseEntity.include====================!!");
    console.log(obj);
  }
  exclude(obj) {
    console.log("!=======BaseEntity.exclude====================!!");
    console.log(obj);
  }
  async deepClone() {
    return await ObjectUtil.deepClone(this);
  }
  load(obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
  }
  toObj() {
    let cloned = ObjectUtil.singleDeepCloneWithoutFuncs(this);
    delete cloned.pk;
    delete cloned.refs;
    this.exclude(cloned);
    return cloned;
  }
}
