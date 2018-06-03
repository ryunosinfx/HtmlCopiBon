import vu from "../../util/viewUtil";
import bc from "../../util/binaryConverter";
import {PrimaryKey} from "../../service/entity/primaryKey";
import {Sorter} from "../../util/sorter";
import {BaseView} from "../../util/reactive/baseView";
import FileUploadExecuter from "../../service/fileUploadExecuter";
const loaded = new Map();
export class FileProcessor extends BaseView {
  constructor(parent) {
    super(parent,"FileProcessor", "FileProcessor");
    this.vpl = this.ms.getViewPartsLoader();
    this.ip = this.ms.ip;
    this.em = this.ms.em;;
    this.tm = this.ms.tm;;
    this.pb = this.vpl.getIndigator(this);
  }
  render() {
    return this.elm;
  }
  async processFiles(files) {
    const fue = new FileUploadExecuter(this.pb);
    const iamageEntitis =  await this.tm.addImageFiles(fue,files);
    for(let imageEntity of iamageEntitis){
      const imagePk = imageEntity.getPk();
      loaded.set(imagePk, imageEntity.name);
    }
    await this.showImages(iamageEntitis);
  }
  async showFilesInit() {
    const title = await this.tm.load();
    const images = title.images;
    const iamageEntitis = [];
    for (let index in images) {
      const pk = images[index];
      if(!pk){
        continue;
      }
      const iamageEntit = await this.em.get(pk);
      iamageEntitis.push(iamageEntit);
    }
    await this.showImages(iamageEntitis);
  }
  async showImages(iamageEntitis){
    Sorter.orderBy(iamageEntitis,[{colName:"listing",isDESC:false},{colName:"updateDate",isDESC:true}]);
    for(let iamageEntity of iamageEntitis){
      if(!iamageEntity){
        continue;
      }
      vu.append(this.elm, await this.crateDataLine(iamageEntity));
    }
  }
  async remove(event, pk) {
    if (window.confirm("delete ok?")) {
      await this.tm.removeImage(pk);
      vu.removeChild(event.target.parentNode.parentNode);
      loaded.delete(pk);
    }
  }
  async crateDataLine(iamageEntity) {
    const imagePk = iamageEntity.getPk();
    const binaryEntity = await this.em.get(iamageEntity.binary);
    const imgElm = await this.ip.createImageNodeByData({name:iamageEntity.name, ab:binaryEntity.ab, type:iamageEntity.type});
    const row = vu.createLi();
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
    iamageEntity.type || 'n/a') + ') - ' + size + 'bytes, last modified: ' + iamageEntity.modifyDate + ' size:' + iamageEntity.width + 'x' + iamageEntity.height);

    vu.append(dataLine, dataStrings);
    vu.append(dataLine, delButton);
    vu.append(row, dataLine);
    vu.append(row, imgElm);
    return row;
  }
}
