import vu from "../viewUtil";
export class BaseView {
  constructor(parent,id,className) {
    this.ms = parent && parent.ms ? parent.ms: null;
    this.id = id;
    this.preRender(id,className);
    if(parent && parent.elm ){
      vu.append(parent.elm, this.elm);
    }
  }
  create(){

  };

  init(){

  }
  preRender(id,className) {
    this.elm = vu.create(id, className);
  }
  render() {
    const elm = vu.create("BaseView", "BaseView");
    return elm;
  }
  getAnker(){
    return this.elm;
  }
}
