import vu from "../../util/viewUtil";
import BaseView from "../baseView";
import FileProcessor from "../parts/fileProcessor";
export default class FilesArea extends BaseView {
  constructor(anker) {
    super(anker);
    this.fp = new FileProcessor(this.elm);
    this.files;
  }
  render() {
    const elm = vu.create("FilesArea", "FilesArea");
    return elm;
  }
}
