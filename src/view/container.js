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
import {ExportArea} from "./content/exportArea";
import {FilesArea} from "./content/filesArea";
import {ProgressBar} from "./parts/progress/progressBar";
import {TitleMng} from "./content/titleMng";
export class Container extends BaseView {
  constructor() {
    super("container", "main-container");
    this.fileUploadArea = new FileUploadArea();
    this.titleSettings = new TitleSettings();
    this.filesArea = new FilesArea();
    this.exportArea = new ExportArea();
    this.progressBar = new ProgressBar();
    this.titleMng = new TitleMng();
  }

  onAfterAttach(store, data) {
    this.fileUploadArea.attach(this);
    this.titleSettings.attach(this);
    this.filesArea.attach(this);
    this.exportArea.attach(this);
    this.progressBar.attach(this);
    this.titleMng.attach(this);
  }
  render() {
    const newVnode = div('',['scroll-container'],{
      style: {
        color: '#000'
      }
    }, [
      div(this.progressBar.id),
      div(this.titleSettings.id),
      div(this.fileUploadArea.id),
      div(this.filesArea.id),
      div(this.exportArea.id),
      div(this.titleMng.id)
    ], "container");
    // console.log('container!render!!!!!!!!!!!')s
    return newVnode;
  }
}
