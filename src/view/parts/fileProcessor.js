import vu from "../../util/viewUtil";
import bc from "../../util/binaryConverter";
import {
  PrimaryKey
} from "../../service/entity/primaryKey";
import {
  Sorter
} from "../../util/sorter";
import {
  BaseView
} from "../../util/reactive/baseView";
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
import {
  ImageActionCreator
} from '../../reduxy/action/imageActionCreator'
import {
  ImageViewReducer
} from '../../reduxy/reducer/imageViewReducer'
const loaded = new Map();
export class FileProcessor extends BaseView {
  constructor() {
    super("FileProcessor", "FileProcessor");
    this.ip = this.ms.ip;
    ImageViewReducer.register();
  }
  onAfterAttach(store, data) {
    const action = ImageActionCreator.creatLoadImagesAction(this, {});
    this.dispatch(action);
  }

  async onViewShow(store, actionData) {
    if (store.imagesData) {
      await this.showImages(store.imagesData);
      console.log("FileProcessor onViewShow");
    }
  }
  render() {
    console.log("A0 FileProcessor render");
    const imageArea = div("imageArea", "AAAAAAAAAAAAAAAAAAAAAAAA");
    return div("", [imageArea]);
  }
  async showImages(iamageEntitis) {
    Sorter.orderBy(iamageEntitis, [{
      colName: "listing",
      isDESC: false
    }, {
      colName: "updateDate",
      isDESC: true
    }]);
    const images = [];
    for (let imageData of iamageEntitis) {
      if (!imageData) {
        continue;
      }
      images.push(await this.crateDataLine(imageData).catch((e) => {
        console.log(e)
      }))
    }
    this.prePatch("#imageArea", div("imageArea", images));
  }
  remove(pk) {
    return (event)=>{
      if (window.confirm("delete ok?")) {
        const action = ImageActionCreator.creatRemoveAction(this, {imagePK:pk});
        this.dispatch(action);
      }
    }
  }
  async crateDataLine(imageData) {
    const imageEntity = imageData.imageEntity;
    const binaryEntity = imageData.binaryEntity;
    console.log(binaryEntity)
    const data = {
      name: imageEntity.name,
      ab: binaryEntity._ab,
      type: imageEntity.type
    }
    const imgElm = await this.ip.createImageNodeByData(data).catch((e) => {
      console.log(e);
      throw e
    });
    const pk = imageEntity.getPk();
    const imgVnode = img(pk, imageEntity.name, imageEntity.name, imgElm.src, {});
    const textVnode = span(pk + "_", ["images"], imageData.imageText);
    const delButton = span(pk + "_delButton", ["delButton"], {on:{"click":this.remove(pk)}},"x");
    const dataLineVnode = div("", ["dataLine"], [delButton, imgVnode, textVnode]);
    const rowVnode = div("", ["row"],[dataLineVnode]);
    return rowVnode;
  }
}
