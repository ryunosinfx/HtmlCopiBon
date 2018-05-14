import vu from "../../util/viewUtil";
import bc from "../../util/binaryConverter";
import BaseView from "../baseView";
const imgRe = /^image\/.+/;
export default class FileProseccor extends BaseView {
  constructor(anker) {
    super(anker);
  }
  render() {
    const elm = vu.createUl("FileProseccor", "FileProseccor");
    return elm;
  }
  async showFiles(fu, files) {
    for (let f of files) {
      let imgElm = await this.createImageNode(fu,f);
      const row = vu.createLi();
      const data = vu.createSpan(null, null, escape(f.name) + ' (' + (
      f.type || 'n/a') + ') - ' + f.size + 'bytes, last modified: ' + f.lastModifiedDate.toLocaleDateString());
      vu.append(row, data);
      vu.append(row, imgElm);
      vu.append(this.elm, row);
    }
  }
  process(fileData) {
    alert("OKOK");
  }
  async createImageNode(fu,file) {
    let arrayBuffer = await fu.readAsArrayBuffer(file);
    let imgElm = vu.createImage();
    if (file.type && file.type.match(imgRe)) {
      console.log(arrayBuffer);
      imgElm.src = bc.arrayBuffer2DataURI(arrayBuffer, file.type);
    }
    imgElm.alt = escape(file.name);
    return imgElm;
  }
}
