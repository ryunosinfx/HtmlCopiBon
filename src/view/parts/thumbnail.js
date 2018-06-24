import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class Thumnail  extends BaseView {
  constructor(index) {
    super("Thumnail"+index, "Thumnail");
    this.index= index ;
  }
  // renderA(store, actionData) {
  //   console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
  //   const button = vu.create("ImageDetailA", "ImageDetailA", this.id);
  //   vu.append(this.elm, button);
  //   return this.elm;
  // }
  render(store, actionData) {
    this.dataLine = div(this.id+"_dataLine_"+this.index);
    this.delButton = span(this.id+"_delButton_"+this.index, "delButton", "☓");
    return div(this.id, "Thumnails");
  }

  async crateDataLine(imageEntity) {
    const imagePk = imageEntity.getPk();
    const binaryEntity = await this.em.get(imageEntity.binary);
    const imgElm = await this.ip.createImageNodeByData({name:imageEntity.name, ab:binaryEntity.ab, type:imageEntity.type});
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
    const dataStrings = vu.createSpan(null, "imageDataLine", escape(imageEntity.name) + ' (' + (
    imageEntity.type || 'n/a') + ') - ' + size + 'bytes, last modified: ' + imageEntity.modifyDate + ' size:' + imageEntity.width + 'x' + imageEntity.height);

    vu.append(dataLine, dataStrings);
    vu.append(dataLine, delButton);
    vu.append(row, dataLine);
    vu.append(row, imgElm);
    return row;
  }
}
