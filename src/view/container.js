import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
import {FileUploadArea} from "./content/fileUploadArea";
import {TitleSettings} from "./content/titleSettings";
import {ExportButton} from "./content/exportButton";
import {FilesArea} from "./content/filesArea";
export class Container extends BaseView {
  constructor(parent) {
    super(parent, "container", "container");
    this.fileUploadArea = new FileUploadArea(this);
    this.titleSettings = new TitleSettings(this);
    this.filesArea = new FilesArea(this);
    this.exportButton = new ExportButton(this);
  }
  updateAsAttach(store, actionData) {
    super.updateAsAttachExecute(store, actionData);
    console.log("Container@updateAsAttach");
    this.fileUploadArea.addEventListeners(this.filesArea.fp);
  }
  render() {
    this.fileUploadArea.attach(this);
    this.titleSettings.attach(this);
    this.filesArea.attach(this);
    this.exportButton.attach(this);
    return this.elm;
  }
}
