import vu from "../util/viewUtil";
import BaseView from "./baseView";
import fua from "./content/fileUploadArea";
export default class Container extends BaseView{
  constructor(anker){
    super(anker);
    this.fua = new fua(this.elm);
  }
  render() {
    const elm = vu.create("container", "container");
    return elm;
  }
}
