import vu from "../util/viewUtil";
export default class BaseView {
  constructor(anker) {
    this.elm = this.render();
    vu.append(anker, this.elm);
  }
  render() {
    const elm = vu.create("BaseView", "BaseView");
    return elm;
  }
  getAnker(){
    return this.elm;
  }
}
