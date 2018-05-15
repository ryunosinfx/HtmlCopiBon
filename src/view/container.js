import vu from "../util/viewUtil";
import BaseView from "./baseView";
import fua from "./content/fileUploadArea";
import fsa from "./content/filesArea";
export default class Container extends BaseView{
  constructor(anker){
    super(anker);
    this.fua = new fua(this.elm);
    this.fsa = new fsa(this.elm);
    this.fua.addEventListeners(this.fsa.fp);
    this.fsa.fp.showFilesInit();
  }
  render() {
    const elm = vu.create("container", "container");
    return elm;
  }
}
