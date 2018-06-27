import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
import {ImageActionCreator} from '../../reduxy/action/imageActionCreator'
export class Thumbnail  extends BaseView {
  constructor(pk) {
    super("Thumnail"+pk, "Thumnail");
    this.pk = pk ;
    this.ip = this.ms.ip;
  }
  setImageData(imageData){
    this.imageData = imageData;
  }
  render(store, actionData) {
    return div('' ,"");
  }
  remove(pk) {
    return (event)=>{
      if (window.confirm("delete ok?")) {
        const action = ImageActionCreator.creatRemoveAction(this, {imagePKforDelete:pk});
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
