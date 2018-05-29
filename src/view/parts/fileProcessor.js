import vu from "../../util/viewUtil";
import bc from "../../util/binaryConverter";
import Sorter from "../../util/sorter";
import BaseView from "../baseView";
import FileUploadExecuter from "../../service/fileUploadExecuter";
const imgRe = /^image\/.+/;
const loaded = new Map();
export default class FileProseccor extends BaseView {
  constructor(anker) {
    super(anker);
    this.vpl = this.ms.getViewPartsLoader();
    this.tm = this.ms.tm;;
    this.bm = this.ms.bm;
    this.im = this.ms.im;
    this.tbm = this.ms.tbm;
    this.pb = this.vpl.getIndigator();
  }
  render() {
    const elm = vu.createUl("FileProseccor", "FileProseccor");
    return elm;
  }
  async processFiles(files) {
    const fue = new FileUploadExecuter(this.pb);
    const title = await this.tm.loadCurrent();
    const images = title.images;
    const iamageEntitis = [];
    let count = images.length;
    for (let file of files) {
      if (loaded.has(file.name)) {
        continue;
      }
      const arrayBuffer = await fue.readAsArrayBuffer(file);
      const data = {
        name: file.name,
        ab: arrayBuffer,
        type: file.type
      };
      const imgElm = await this.createImageNodeByData(data);
      const arrayBufferThumbnail = bc.dataURI2ArrayBuffer(await this.ms.createThumbnail(arrayBuffer, 100, 100, file.type));
      const imgElmThumb = await this.createImageNodeByData({name: file.name, ab: arrayBufferThumbnail, type: file.type});
      const thumbnailEntity = await this.tbm.save(null, file.name, arrayBufferThumbnail, file.type, imgElmThumb.width, imgElmThumb.height, 0);
      const imageEntity = await this.im.save(null, file.name, arrayBuffer, file.type, imgElm.width, imgElm.height, thumbnailEntity, count);
      //console.log(data);
      //vu.insertFirst(this.elm, await this.crateDataLine(imageEntity));
      const imagePk = imageEntity.getPk();
      loaded.set(imagePk, imageEntity.name);
      count++;
      images.push(imagePk);
      iamageEntitis.push(imageEntity);
    }
    await this.tm.saveTitle(title);
    await this.showImages(iamageEntitis);
  }
  async showImages(iamageEntitis){
    Sorter.orderBy(iamageEntitis,[{colName:"listing",isDESC:false},{colName:"updateDate",isDESC:true}]);
    for(let iamageEntity of iamageEntitis){
      vu.append(this.elm, await this.crateDataLine(iamageEntity));
    }
  }
  async showFilesInit() {
    const title = await this.tm.loadCurrent();
    console.log("this.tm.loadCurrent");
    console.log(title);
    const images = title.images;
    const imagesList = [];
    for (let pk of images) {
      imagesList.push(await this.im.load(pk));
    }
  }
  async remove(event, pk) {
    if (window.confirm("delete ok?")) {
      const title = this.tm.loadCurrent();
      console.log("this.tm.loadCurrent");
      console.log(title);
      const images = title.images;
      vu.removeChild(event.target.parentNode.parentNode);
      loaded.delete(pk);
      delete images[pk];
      await this.tm.saveTitle(title);
    }
  }
  async crateDataLine(iamageEntity) {
    const imagePk = iamageEntity.getPk();
    const binaryEntity = this.bm.load(iamageEntity.binary);
    const imgElm = await this.createImageNodeByData({name:iamageEntity.name, ab:binaryEntity.ab, type:iamageEntity.type});
    const row = vu.createLi();
    //console.log(row);
    const delButton = vu.create(null, "delButton", "☓");
    vu.on(delButton, "click", (e) => {
      this.remove(e, imagePk)
    });
    const size = (
      binaryEntity.ab
      ? (new Uint8Array(binaryEntity.ab)).length
      : 0);
    const dataLine = vu.create();
    const dataStrings = vu.createSpan(null, "imageDataLine", escape(iamageEntity.name) + ' (' + (
    type || 'n/a') + ') - ' + size + 'bytes, last modified: ' + iamageEntity.modifyDate + ' size:' + iamageEntity.width + 'x' + iamageEntity.height);
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
