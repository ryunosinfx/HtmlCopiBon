import {ActionCreator} from '../../util/reactive/actionCreator'
import {ImageActionCreator} from '../action/imageActionCreator'

import {Sorter} from "../../util/sorter";
import {MainService} from "../../service/mainService"
import {BaseReducer} from '../../util/reactive/baseReducer'
import {FileUploadExecuter} from "../../service/fileUploadExecuter";
let imageViewReducer=null;
export class ImageViewReducer extends BaseReducer {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.vpl = this.ms.getViewPartsLoader();
    this.ip = this.ms.ip;
    this.em = this.ms.em;
    this.tm = this.ms.tm;
    this.imagAddAction = ImageActionCreator.creatAddAction();
    this.imageRemoveAction = ImageActionCreator.creatRemoveAction();
    this.imagesLoadAction = ImageActionCreator.creatLoadImagesAction();
    this.imagesSortAction = ImageActionCreator.creatSortImagesAction();
    this.atatch(this.imagAddAction);
    this.atatch(this.imageRemoveAction);
    this.atatch(this.imagesLoadAction);
    this.atatch(this.imagesSortAction);
  }
  static register(){
    if(!imageViewReducer){
      imageViewReducer = new ImageViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.imagAddAction.type === action.type) {
      const imagesData = await this.saveFiles(action.data.files);
      store["imagesData"] = imagesData;
    } else if (this.imageRemoveAction.type === action.type) {
      await this.remove(action.data.imagePK);
    } else if (this.imagesLoadAction.type === action.type) {
      const imagesData = await this.loadImages();
      store["imagesData"] = imagesData;
    } else if (this.imagesSortAction.type === action.type) {
      //todo db add
    }
    return store;
  }
  async saveFiles(files) {
    const fue = new FileUploadExecuter(this.pb);
    const imageEntitis =  await this.tm.addImageFiles(fue,files);
    console.log("=★=processFiles");
    Sorter.orderBy(imageEntitis, [
      {
        colName: "listing",
        isDESC: false
      }, {
        colName: "updateDate",
        isDESC: true
      }
    ]);
    console.log("=★=showFilesInit imageEntitis:" + imageEntitis.length);
    const retList = [];
    for(let imageEntity of imageEntitis){
      retList.push(await this.processParImage(imageEntity));
    }
    return retList;
  }

  async loadImages() {
    const title = await this.tm.load();
    const images = title.images;
    const imageEntitis = [];

    for (let index in images) {
      const pk = images[index];
      if (!pk) {
        continue;
      }
      const iamageEntity = await this.em.get(pk);
      imageEntitis.push(iamageEntity);
    }
    Sorter.orderBy(imageEntitis, [
      {
        colName: "listing",
        isDESC: false
      }, {
        colName: "updateDate",
        isDESC: true
      }
    ]);
    console.log("=★=showFilesInit imageEntitis:" + imageEntitis.length);
    const retList = [];
    for(let imageEntity of imageEntitis){
      retList.push(await this.processParImage(imageEntity));
    }
    return retList;
  }
  async processParImage(iamageEntity){
      const imagePk = iamageEntity.getPk();
      const binaryEntity = await this.em.get(iamageEntity.binary);
      const imgElm = await this.ip.createImageNodeByData({name:iamageEntity.name, ab:binaryEntity.ab, type:iamageEntity.type});
      const size = (
        binaryEntity.ab
        ? (new Uint8Array(binaryEntity.ab)).length
        : 0);
      const imageText =  escape(iamageEntity.name) + ' (' + (
      iamageEntity.type || 'n/a') + ') - ' + size + 'bytes, last modified: ' + iamageEntity.modifyDate + ' size:' + iamageEntity.width + 'x' + iamageEntity.height

      const retObj = {iamageEntity:iamageEntity,binaryEntity:binaryEntity,size:size,imageText:imageText};
      return retObj;
  }
  async remove(pk) {
      await this.tm.removeImage(pk);
  }
}
// setTimeout(ImageViewReducer.register,1);
