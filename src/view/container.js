import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../util/reactive/base/vtags";
import {FileUploadArea} from "./content/fileUploadArea";
import {TitleSettings} from "./content/titleSettings";
import {ExportButton} from "./content/exportButton";
import {FilesArea} from "./content/filesArea";
export class Container extends BaseView {
  constructor() {
    super("container", "container");
    this.fileUploadArea = new FileUploadArea();
    this.titleSettings = new TitleSettings();
    this.filesArea = new FilesArea();
    this.exportButton = new ExportButton();
  }

  onAfterAttach(store, data) {
    this.fileUploadArea.attach(this);
    this.titleSettings.attach(this);
    this.filesArea.attach(this);
    this.exportButton.attach(this);
  }
  render() {
    const newVnode = div({
      style: {
        color: '#000'
      }
    }, [
      div(this.fileUploadArea.id),
      div(this.titleSettings.id),
      div(this.filesArea.id),
      div(this.exportButton.id)
    ], "container");
    // console.log('container!render!!!!!!!!!!!')s
    return newVnode;
  }
}
