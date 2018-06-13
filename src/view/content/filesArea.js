import vu from "../../util/viewUtil";
import {
  BaseView
} from "../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../util/reactive/base/vtags";
import {
  FileProcessor
} from "../parts/fileProcessor";
import {
  ImageDetail
} from "../parts/imageDetail";
import {
  PageImages
} from "../parts/pageImages";
export class FilesArea extends BaseView {
  constructor() {
    super( "FilesArea", "FilesArea");
    this.fp = new FileProcessor(this);
    this.imageDetail = new ImageDetail(this);
    this.pageImages = new PageImages(this);
  }
  updateAsAttach(store, actionData) {
    super.updateAsAttachExecute(store, actionData);
    console.log("FilesArea@updateAsAttach");
    this.fp.showFilesInit();
  }
  render() {
    this.fp.attach(this);
    this.imageDetail.attach(this);
    this.pageImages.attach(this);
    return this.elm;
  }
}
