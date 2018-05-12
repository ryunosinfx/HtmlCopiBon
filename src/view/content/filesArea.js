import vu from "../../util/viewUtil";
import BaseView from "../baseView";
import fp from "../parts/fileProcessor";
export default class FilesArea extends BaseView {
  constructor(anker) {
    super(anker);
    this.fp = new fp(this.elm);
    this.files;
  }
  render() {
    const elm = vu.create("FilesArea", "FilesArea");
    return elm;
  }
}
