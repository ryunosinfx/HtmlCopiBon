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
    if (store.imagesData) {
      this.showImages(store.imagesData);
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
      console.log(imageData);
      console.log(this.currentVnode.elm.parentNode);
      //alert("showImages imageData!"+imageData)
      images.push(await this.crateDataLine(imageData).catch((e) => {
        console.log(e)
      }))
      //alert("showImages imageData!"+imageData)
    }
    console.log("showImages images");
    console.log(images);
    //alert("aaa")
    this.prePatch("#imageArea", div("imageArea", images));
  }
  async remove(event, pk) {
    if (window.confirm("delete ok?")) {
      await this.tm.removeImage(pk);
      vu.removeChild(event.target.parentNode.parentNode);
      loaded.delete(pk);
    }
  }
  async crateDataLine(imageData) {
    const imageEntity = imageData.imageEntity;
    const binaryEntity = imageData.binaryEntity;
    console.log(binaryEntity)
    const data = {
      name: imageEntity.name,
      ab: binaryEntity.data,
      type: imageEntity.type
    }
    //alert("crateDataLine imageData!"+binaryEntity.data)
    console.log('!!!!!!!!!!!!!!!-----------------------')
    console.log(data)
    const imgElm = await this.ip.createImageNodeByData(data).catch((e) => {
      console.log(e);
      throw e
    });

    alert("crateDataLine imageData! ok01 " + imgElm)
    const imgVnode = img(imageEntity.getPk(), imageEntity.name, imageEntity.name, imgElm.src, {});
    //alert("crateDataLine imageData! ok02 "+imageData)
    const textVnode = span(imageEntity.getPk() + "_", [], imageData.imageText);
    const delButton = span(imageEntity.getPk() + "_delButton", ["delButton"], "x");
    const dataLineVnode = div("", ["dataLine"], [delButton, imgVnode, textVnode]);
    const rowVnode = div("", ["row"][dataLineVnode]);
    return rowVnode;
  }
}
