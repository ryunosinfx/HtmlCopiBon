import vu from "../../util/viewUtil";
import bc from "../../util/binaryConverter";
import BaseView from "../baseView";
import FileUploadExecuter from "../../service/fileUploadExecuter";
const imgRe = /^image\/.+/;
export default class FileProseccor extends BaseView {
  constructor(anker) {
    super(anker);
    this.vpl = this.ms.getViewPartsLoader();
    this.pb = this.vpl.getIndigator();
  }
  render() {
    const elm = vu.createUl("FileProseccor", "FileProseccor");
    return elm;
  }
  async processFiles(files) {
    const fue = new FileUploadExecuter(this.pb);
    for (let file of files) {
      let arrayBuffer = await fue.readAsArrayBuffer(file);
      let imgElm = await this.createImageNode(arrayBuffer, file);
      const data = {
          ab: arrayBuffer,
        name: file.name,
        type: file.type,
        modifyDate: file.lastModifiedDate.toLocaleDateString()
      };
      this.ms.save(data);
      console.log(data);
      const row = vu.createLi();
      const dataLine = vu.createSpan(null, null, escape(file.name) + ' (' + (
      file.type || 'n/a') + ') - ' + file.size + 'bytes, last modified: ' + file.lastModifiedDate.toLocaleDateString());
      vu.append(row, dataLine);
      vu.append(row, imgElm);
      vu.append(this.elm, row);
    }
  }
  async createImageNode(arrayBuffer, file) {
    let imgElm = vu.createImage();
    if (file.type && file.type.match(imgRe)) {
      imgElm.src = bc.arrayBuffer2DataURI(arrayBuffer, file.type);
    }
    imgElm.alt = escape(file.name);
    return imgElm;
  }
  async showFilesInit() {
    const datas = await this.ms.loadImages();
    for (let record of datas) {
      let {pk, data} = record;
      let {name, ab, type, modifyDate} = data;
      console.log(ab);
      let imgElm = this.createImageNodeByData(data);
      const row = vu.createLi();
      const dataLine = vu.createSpan(null, null, escape(name) + ' (' + (
      type || 'n/a') + ') - ' + (ab? (new Uint8Array(ab)).length: 0) + 'bytes, last modified: ' + modifyDate);
      vu.append(row, dataLine);
      vu.append(row, imgElm);
      vu.append(this.elm, row);
    }
  }
  createImageNodeByData(data) {
    let {name,ab, type} = data;
    let imgElm = vu.createImage();
    if (type && type.match(imgRe)) {
      console.log(ab);
      imgElm.src = bc.arrayBuffer2DataURI(ab, type);
      //imgElm.src = bc.base642DataURI(base64, type);
    }
    imgElm.alt = escape(name);
    return imgElm;
  }
}
