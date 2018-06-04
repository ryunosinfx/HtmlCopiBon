import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {FileUploadArea} from "./content/fileUploadArea";
import {FilesArea} from "./content/filesArea";
export class Container extends BaseView {
  constructor(parent) {
    super(parent, "container", "container");
    this.fileUploadArea = new FileUploadArea(this);
    this.filesArea = new FilesArea(this);
  }
  updateAsAttach(store, actionData){
    super.updateAsAttachExecute(store, actionData);
    console.log("Container@updateAsAttach");
    this.fileUploadArea.addEventListeners(this.filesArea.fp);
  }
  render() {
    this.fileUploadArea.attach(this);
    this.filesArea.attach(this);
    return this.elm;
  }
}
