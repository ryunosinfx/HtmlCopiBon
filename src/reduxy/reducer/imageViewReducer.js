import {ActionCreator} from '../../util/reactive/actionCreator'
import {ImageActionCreator} from '../action/imageActionCreator'

import {Sorter} from "../../util/sorter";
import {MainService} from "../../service/mainService"
import {BaseReducer} from '../../util/reactive/baseReducer'
import {FileUploadExecuter} from "../../service/fileUploadExecuter";
let imageViewReducer = null;
const loadedImageMap = new Map();
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
    this.imagesChangeTitleAction = ImageActionCreator.creatChangeTitleImagesAction();
    this.atatch(this.imagAddAction);
    this.atatch(this.imageRemoveAction);
    this.atatch(this.imagesLoadAction);
    this.atatch(this.imagesSortAction);
    this.atatch(this.imagesChangeTitleAction);
  }
  static register() {
    if (!imageViewReducer) {
      imageViewReducer = new ImageViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.imagAddAction.type === action.type) {
      const imagesData = await this.saveFiles(action.data.files);
      store["imagesData"] = imagesData;
    } else if (this.imageRemoveAction.type === action.type) {
      const imagesData = await this.remove(action.data.imagePKforDelete);
      store["imagesData"] = imagesData;
    } else if (this.imagesLoadAction.type === action.type) {
      const imagesData = await this.loadImages();
      store["imagesData"] = imagesData;
    } else if (this.imagesSortAction.type === action.type) {
      const imagesData = await this.sort(action.data.imagePKmove, action.data.imagePKdrop);
      store["imagesData"] = imagesData;
      //todo db add
    } else if (this.imagesChangeTitleAction.type === action.type) {
      //todo db add
    }
    return store;
  }
  async saveFiles(files) {
    const fue = new FileUploadExecuter();
    const imageEntitis = await this.tm.addImageFiles(fue, files);
    console.log("=★=processFiles");
    const retList = this.getEntitisAsList();
    for (let imageEntity of imageEntitis) {
      retList.unshift(imageEntity);
    }
    return await this.createRetList(retList);
  }

  async sort(movePk, dropPk) {
    console.log('sort movePk:'+movePk+'/dropPk:'+dropPk)
    const imageEntitis = this.getEntitisAsList();

    for (let index in imageEntitis) {
      const imageEntity = imageEntitis[index];
      const pk = imageEntity.getPk();
        console.log('sort pk:'+pk+'/index:'+index+'/imageEntity.listing:'+imageEntity.listing)
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
    const converterMap = {};
    converterMap[movePk] = dropPk;
    converterMap[dropPk] = movePk;
    for (let index in imageEntitis) {
      const imageEntity = imageEntitis[index];
      const pk = imageEntity.getPk();
        console.log('sort pk:'+pk+'/index:'+index+'/imageEntity.listing:'+imageEntity.listing)
      const convertedPk = converterMap[pk]
        ? converterMap[pk]
        : pk;
      if (convertedPk !== pk) {
        const imageEntityConverted = loadedImageMap.get(convertedPk).imageEntity;
        imageEntityConverted.listing = index;
        imageEntityConverted.updateDate = Date.now();
        await this.em.save(imageEntityConverted);
      } else {
        imageEntity.listing = index;
      }
    }
    return await this.createRetList(imageEntitis);
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
      const imageEntity = await this.em.get(pk);
      imageEntitis.push(imageEntity);
    }
    return await this.createRetList(imageEntitis);
  }

  async createRetList(imageEntitis) {
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
    for (let imageEntity of imageEntitis) {
      const pk = imageEntity.getPk();
      if (loadedImageMap.has(pk)) {
        const retObj = loadedImageMap.get(pk);
        retList.push(retObj);
      } else {
        const retObj = await this.processParImage(imageEntity);
        loadedImageMap.set(pk, retObj);
        retList.push(retObj);
      }
    }
    return retList;
  }
  async processParImage(imageEntity) {
    const imagePk = imageEntity.getPk();
    const thumbnailEntity = await this.em.get(imageEntity.thumbnail);
    const binaryEntity = await this.em.get(thumbnailEntity.binary);
    const imgElm = await this.ip.createImageNodeByData({name: imageEntity.name, ab: binaryEntity.ab, type: imageEntity.type});
    const size = (
      binaryEntity.ab
      ? (new Uint8Array(binaryEntity.ab)).length
      : 0);
    const imageText = escape(imageEntity.name) + ' (' + (
    imageEntity.type || 'n/a') + ') - ' + size + 'bytes, last modified: ' + imageEntity.modifyDate + ' size:' + imageEntity.width + 'x' + imageEntity.height

    const retObj = {
      imageEntity: imageEntity,
      binaryEntity: binaryEntity,
      size: size,
      imageText: imageText
    };
    return retObj;
  }
  async remove(pk) {
    await this.tm.removeImage(pk);
    loadedImageMap.delete(pk);
    return this.getRetObjsAsList();
  }
  getRetObjsAsList() {
    const retList = [];
    for (let [key, retObj] of loadedImageMap.entries()) {
      retList.push(retObj);
    }
    return retList;
  }
  getEntitisAsList() {
    const retList = [];
    for (let [key, retObj] of loadedImageMap.entries()) {
      retList.push(retObj.imageEntity);
    }
    return retList;
  }

}
// setTimeout(ImageViewReducer.register,1);
