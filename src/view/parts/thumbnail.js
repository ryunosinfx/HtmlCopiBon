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
