import vu from "../../util/viewUtil";
import bc from "../../util/binaryConverter";
import BaseView from "../baseView";
import FileUploadExecuter from "../../service/fileUploadExecuter";
const imgRe = /^image\/.+/;
const loaded = new Map();
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
      if (loaded.has(file.name)) {
        continue;
      }
      loaded.set(file.name, file.name);
      let arrayBuffer = await fue.readAsArrayBuffer(file);
      let arrayBufferA = bc.dataURI2ArrayBuffer(await this.ms.createThumbnail(arrayBuffer,100,100,file.type)) ;
      const data = {
        ab: arrayBufferA,
        name: file.name,
        type: file.type,
        modifyDate: file.lastModifiedDate.toLocaleDateString()
      };
      //console.log(data);
      data.pk = file.name;
      vu.insertFirst(this.elm, await this.crateDataLine(data));
      delete data.pk;
      this.ms.save(data);
    }
  }
  async showFilesInit() {
    const datas = await this.ms.loadImages();
    for (let record of datas) {
      let {name, ab, type, modifyDate} = record.data;
      loaded.set(record.pk, name);
      let data = {
        pk: record.pk,
        name: name,
        ab: ab,
        type: type,
        modifyDate: modifyDate
      };
      vu.append(this.elm, await this.crateDataLine(data));
    }
  }
  remove(event, pk) {
    if (window.confirm("delete ok?")) {
      vu.removeChild(event.target.parentNode.parentNode);
      loaded.delete(pk);
      this.ms.delete(pk);
    }
  }
  async crateDataLine(data) {
    let {pk, name, ab, type, modifyDate} = data;
    const imgElm = await this.createImageNodeByData(data);
    const row = vu.createLi();
    //console.log(row);
    const delButton = vu.create(null, "delButton", "☓");
    vu.on(delButton, "click", (e) => {
      this.remove(e, pk)
    });
    const size = (
      ab
      ? (new Uint8Array(ab)).length
      : 0);
    const dataLine = vu.create();
    const dataStrings = vu.createSpan(null, "imageDataLine", escape(name) + ' (' + (
    type || 'n/a') + ') - ' + size + 'bytes, last modified: ' + modifyDate + ' size:' + data.width + 'x' + data.height);
    vu.append(dataLine, dataStrings);
    vu.append(dataLine, delButton);
    vu.append(row, dataLine);
    vu.append(row, imgElm);
    return row;
  }

  createImageNodeByData(data) {
    return new Promise((resolve, reject) => {
      let {name, ab, type} = data;
      let imgElm = vu.createImage();
      imgElm.alt = escape(name);
      if (type && type.match(imgRe)) {
        //console.log(ab);
        imgElm.src = bc.arrayBuffer2DataURI(ab, type);
        //imgElm.src = bc.base642DataURI(base64, type);
        imgElm.onload = () => {
          data.height = imgElm.height;
          data.width = imgElm.width;
          resolve(imgElm);
        }
      } else {
        resolve(imgElm);
      }
    });
  }
}
