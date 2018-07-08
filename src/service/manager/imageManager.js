import {Images} from "../../entity/images";
import {MainService} from "../../service/mainService";
import bc from "../../util/binaryConverter";
import {PrimaryKey} from "../entity/primaryKey";
import {Sorter} from "../../util/sorter";
import {FileUploadExecuter} from "../fileUploadExecuter";

export class ImageManager {
  constructor(entityManager) {
    this.ms = MainService.getInstance();
    this.em = entityManager;
    this.ip = this.ms.ip;
    this.tbm = this.ms.tbm;
  }
  async load(pk) {
    let binaryPk = pk;
    if (!pk) {
      binaryPk = PrimaryKey.getPrimaryKey(pk);
    }
    return await this.em.Images.get(binaryPk);
  }
  async remove(pk) {
    const imageEntity = await this.em.get(pk);
    console.log("removeImage imageEntity.thumbnail:" + imageEntity.thumbnail);
    const binaryPk = PrimaryKey.getPrimaryKey(imageEntity.binary);
    console.log("removeImage binaryPk:" + binaryPk);
    const thumbnailPk = PrimaryKey.getPrimaryKey(imageEntity.thumbnail);
    console.log("removeImage thumbnailPk:" + thumbnailPk);
    if (thumbnailPk) {
      const thumbnailEntity = await this.em.get(thumbnailPk);
      console.log("removeImage thumbnailEntity:" + thumbnailEntity);
      const thumbnailBinaryPk = PrimaryKey.getPrimaryKey(thumbnailEntity.binary);
      console.log("removeImage thumbnailBinaryPk:" + thumbnailBinaryPk);
      await this.em.delete(thumbnailBinaryPk);
      await this.em.delete(thumbnailPk);
    }
    await this.em.delete(binaryPk);
    await this.em.delete(pk);
  }
  async saveImageFile(file, count = 0) {
    const fue = new FileUploadExecuter();
    const arrayBuffer = await fue.readAsArrayBuffer(file);
    const data = {
      name: file.name,
      ab: arrayBuffer,
      type: file.type
    };
    const imgElm = await this.ip.createImageNodeByData(data);
    const dataURI = await this.ip.createThumbnail(arrayBuffer, 100, 100, file.type);
    const arrayBufferThumbnail = bc.dataURI2ArrayBuffer(dataURI);
    const imgElmThumb = await this.ip.createImageNodeByData({name: file.name, ab: arrayBufferThumbnail, type: file.type});
    const thumbnailEntity = await this.tbm.save(null, file.name, arrayBufferThumbnail, file.type, imgElmThumb.width, imgElmThumb.height, 0);
    console.log("addImageFiles thumbnailEntity:" + thumbnailEntity);
    const thumbnailPk = PrimaryKey.getPrimaryKey(thumbnailEntity);
    console.log("addImageFiles thumbnailPk:" + thumbnailPk);
    const imageEntity = await this.save(null, file.name, arrayBuffer, file.type, imgElm.width, imgElm.height, thumbnailPk, count);
    console.log("addImageFiles imageEntity:" + imageEntity);
    const imagePk = imageEntity.getPk();
    return {imagePk: imagePk, imageEntity: imageEntity};
  }
  async save(pk, name, binary, type, width, height, thumbnail, listing = 0) {
    let image = null;
    if (pk) {
      image = await this.em.Images.get(pk);
    }
        console.log("ImageManager save!!9!! binary:" + binary);
    let binaryPk = PrimaryKey.getPrimaryKey(binary);
    if (!image) {
      image = new Images();
    } else {
      image.updateDate = Date.now();
    }

    console.log("ImageManager save!!A!! image:" + image);
    image.name = name || name === null
      ? name
      : image.name;
    image.binary = binaryPk
      ? binaryPk
      : binary;
    image.type = type || type === null
      ? type
      : image.type;
    image.width = width || width === null
      ? width
      : image.width;
    image.height = height || height === null
      ? height
      : image.height;
    image.thumbnail = thumbnail || thumbnail === null
      ? thumbnail
      : PrimaryKey.getPrimaryKey(image.thumbnail);
    image.listing = listing || listing === null
      ? listing
      : image.listing;
    const savedData = await this.em.Images.save(image);
    console.log("ImageManager save!!B!! image:" + savedData);
    return savedData;
  }

  async loadThumbnails(images) {
    const retList = [];
    const imageList = [];
    for (let image of images) {
      const imagePk = PrimaryKey.getPrimaryKey(image);
      const imageEntity = await this.load(imagePk);
      imageList.push(imageEntity);
    }
    Sorter.orderBy( imageList,[{colName:"listing", isDESC:false}]);
    for (let imageEntity of imageList) {
      const imagePk = PrimaryKey.getPrimaryKey(imageEntity);
      const thumbnailEntity = await this.tbm.loadFromImagePk(imagePk);
      retList.push(thumbnailEntity);
    }
    return retList;
  }
}
