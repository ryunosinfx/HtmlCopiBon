import vu from "../../util/viewUtil";
import bc from "../../util/binaryConverter";
import {PrimaryKey} from "../../service/entity/primaryKey";
import {Sorter} from "../../util/sorter";
import {BaseView} from "../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../util/reactive/base/vtags";
// import {FileUploadExecuter} from "../../service/fileUploadExecuter";
import {ImageActionCreator} from '../../reduxy/action/imageActionCreator'
import {ImageViewReducer} from '../../reduxy/reducer/imageViewReducer'
const loaded = new Map();
export class FileProcessor extends BaseView {
  constructor() {
    super("FileProcessor", "FileProcessor");
    // this.vpl = this.ms.getViewPartsLoader();
    this.ip = this.ms.ip;
    // this.em = this.ms.em;;
    // this.tm = this.ms.tm;;
    // this.pb = this.vpl.getIndigator(this);
    ImageViewReducer.register();
  }
  onAfterAttach(store, data) {
    const action = ImageActionCreator.creatLoadImagesAction(this, {});
    this.dispatch(action);
  }

  onViewShow(store, actionData) {
    // console.log("A0 FileProcessor onViewShow------------------");
    // console.log(store);
    // console.log(actionData);
    if (store.imagesData) {
      // alert("store.imagesData)!"+store.imagesData)
      this.showImages(store.imagesData);
    }
  }
  render() {
    console.log("A0 FileProcessor render");
    const imageArea = div("imageArea","AAAAAAAAAAAAAAAAAAAAAAAA");
    return div("",[imageArea]);
  }
  // async processFiles(files) {
  //   const fue = new FileUploadExecuter(this.pb);
  //   const iamageEntitis =  await this.tm.addImageFiles(fue,files);
  //   for(let imageEntity of iamageEntitis){
  //     const imagePk = imageEntity.getPk();
  //     loaded.set(imagePk, imageEntity.name);
  //   }
  //   console.log("=★=processFiles");
  //   await this.showImages(iamageEntitis);
  // }
  // async showFilesInit() {
  //   const title = await this.tm.load();
  //   const images = title.images;
  //   const iamageEntitis = [];
  //   for (let index in images) {
  //     const pk = images[index];
  //     if(!pk){
  //       continue;
  //     }
  //     const iamageEntit = await this.em.get(pk);
  //     iamageEntitis.push(iamageEntit);
  //   }
  //   await this.showImages(iamageEntitis);
  //   console.log("=★=showFilesInit iamageEntitis:"+iamageEntitis.length);
  // }
  async showImages(iamageEntitis) {
    Sorter.orderBy(iamageEntitis, [
      {
        colName: "listing",
        isDESC: false
      }, {
        colName: "updateDate",
        isDESC: true
      }
    ]);
    const images = [];
    for (let imageData of iamageEntitis) {
      if (!imageData) {
        continue;
      }
      console.log(imageData);
      console.log(this.currentVnode.elm.parentNode);
      // const dataStrings = vu.createSpan(null, "imageDataLine", "imageText");
      // vu.append(this.currentVnode.elm, dataStrings);
      // vu.append(this.currentVnode.elm, await this.crateDataLine(imageData));
      images.push(await this.crateDataLine(imageData))
    }
    this.prePatch("#"+imageArea, div("",images)) ;
  }
  async remove(event, pk) {
    if (window.confirm("delete ok?")) {
      await this.tm.removeImage(pk);
      vu.removeChild(event.target.parentNode.parentNode);
      loaded.delete(pk);
    }
  }
  async crateDataLine(imageData) {
    const iamageEntity = imageData.iamageEntity;
    const binaryEntity = imageData.binaryEntity;
    const imgElm = await this.ip.createImageNodeByData({name: iamageEntity.name, ab: binaryEntity.ab, type: iamageEntity.type});

    const imgVnode =img(iamageEntity.getPk(), iamageEntity.name, iamageEntity.name, imgElm.src, {}) ;
    const textVnode = span(iamageEntity.getPk()+"_",[],imageData.imageText);
    const delButton = span(iamageEntity.getPk()+"_delButton",["delButton"],"x");
    const dataLineVnode = div("",["dataLine"],[delButton,imgVnode,textVnode]);
    const rowVnode = div("",["row"][dataLineVnode]);
    //
    // const row = vu.createLi();
    // const delButton = vu.create(null, "delButton", "☓");
    // vu.on(delButton, "click", (e) => {
    //   this.remove(e, iamageEntity.getPk())
    // });
    // const dataLine = vu.create();
    // const dataStrings = vu.createSpan(null, "imageDataLine", imageData.imageText);
    //
    // vu.append(dataLine, dataStrings);
    // vu.append(dataLine, delButton);
    // vu.append(row, dataLine);
    // vu.append(row, imgElm);
    return rowVnode;
  }
}
