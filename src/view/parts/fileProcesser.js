import vu from "../../util/viewUtil";
import BaseView from "../baseView";
export default class FileProseccer extends BaseView{
  constructor(anker) {
    super(anker);
  }
  render() {
    const elm = vu.createUl("FileProseccer", "FileProseccer");
    return elm;
  }
  showFiles(files) {
    let output = [];
    for (let f of files) {
      const row = vu.crateLi();
      const data = vu.crateSpan(null, null, escape(f.name) + ' (' + (
      f.type || 'n/a') + ') - ' + f.size + 'bytes, last modified: ' + f.lastModifiedDate.toLocaleDateString());
      vu.append(row, data);
      vu.append(this.elm, row);
    }
  }
}
