import BaseEntity from "./baseEntity";
export default class Binary extends BaseEntity {
  constructor(arrayBuffer) {
    super();
    this.data = arrayBuffer;
    this.createDate = Date.now();
    this.updateDate = Date.now();
  }
  set ab(_ab){
    if(buffer && !buffer.byteLength){
      alert("not arrayBuffer!");
    }
    this.data=_ab;
  }
  get ab(){
    return this.data;
  }

  create() {
    return new Binary();
  }
}
