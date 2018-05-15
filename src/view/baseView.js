import vu from "../util/viewUtil";
import MainService from "../service/mainService";
export default class BaseView {
  constructor(anker) {
    this.elm = this.render();
    this.ms = MainService.getInstance();
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
