import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {FileProcessor} from "../parts/fileProcessor";
export class FilesArea extends BaseView {
  constructor(parent) {
    super(parent,"FilesArea", "FilesArea");
    this.fp = new FileProcessor(this);
    this.files;
  }
  render() {
    return this.elm;
  }
}
