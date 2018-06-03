import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {FileUploadArea} from "./content/fileUploadArea";
import {FilesArea} from "./content/filesArea";
export class Container extends BaseView{
  constructor(parent){
    super(parent,"container", "container");
    this.fua = new FileUploadArea(this);
    this.fsa = new FilesArea(this);
    this.fua.addEventListeners(this.fsa.fp);
    this.fsa.fp.showFilesInit();
  }
  render() {
    this.fua.attach(this);
      this.fsa.attach(this);
    return this.elm;
  }
}
