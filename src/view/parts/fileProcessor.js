import vu from "../../util/viewUtil";
import BaseView from "../baseView";
export default class FileProseccor extends BaseView{
  constructor(anker) {
    super(anker);
  }
  render() {
    const elm = vu.createUl("FileProseccor", "FileProseccor");
    return elm;
  }
  showFiles(files) {
    for (let f of files) {
      const row = vu.createLi();
      const data = vu.createSpan(null, null, escape(f.name) + ' (' + (
      f.type || 'n/a') + ') - ' + f.size + 'bytes, last modified: ' + f.lastModifiedDate.toLocaleDateString());
      vu.append(row, data);
      vu.append(this.elm, row);
    }
  }
  process(fileData){
    alert("OKOK");
  }
}
