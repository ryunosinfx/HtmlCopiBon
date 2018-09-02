import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import bc from "../../util/binaryConverter";

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
export class ImageDetail extends BaseView {
  constructor() {
    super("ImageDetail", "ImageDetail");
    this.imageAreaID = this.id + "child";
    this.isOnScroll = false;
    this.startX = 0;
    this.startY = 0;
  }
  render(store, actionData) {
    return div("",[""],[div("", ["ImageDetailTitle"],"ImageDetailTitle"),div(this.imageAreaID, ["ImageDetailA"], "No Image Selected")]);
  }
  async onViewShow(store, actionData) {
    if (store.imagesDetailData) {
      await this.showImage(store.imagesDetailData);
      this.startX = 0;
      this.startY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.isOnScroll = false;
    }
  }

  async showImage(imageData) {
    const {imageEntity, binaryEntity, imageText} = imageData;
    const pk = imageEntity.getPk();
    const dataUri = bc.arrayBuffer2DataURI(binaryEntity._ab);
    const imgVnode = img(pk + "_image", imageEntity.name, imageEntity.name, dataUri, {});
    const textVnode = span(pk + "_text", ["thumbnail_text"], imageData.imageText);
    const image = [
      div("", [""], [imgVnode]),
      div("", [textVnode])
    ]
    this.prePatch("#" + this.imageAreaID, div(this.imageAreaID, ["image_detail_block"], {
      on: {
        mousedown: this.onMouseOn(),
        mousemove: this.onMouseMove()
      },
      style:{top:0,left:0}
    }, image));
  }
  click() {
    return(event) => {
      alert("click");
    }
  }
  onMouseOn() {
    return(event) => {
      // alert("onMouseOn");
      this.startX = this.offsetX
        ? event.clientX+this.offsetX*0-this.offsetX１
        : event.clientX;
      this.startY = this.offsetY
        ? event.clientY+this.offsetY*0-this.offsetY１
        : event.clientY;
      const elm = event.target;
      this.isOnScroll = this.isOnScroll?false:true;
    }
  }
  onMouseOff() {
    return(event) => {
      // alert("onMouseOff");
      const elm = event.target;
      this.isOnScroll = false;
    }
  }
  onMouseMove() {
    return(event) => {
      const elm = event.target;
      if (this.isOnScroll) {
        const currentX = event.clientX;
        const currentY = event.clientY;
        const offsetX = currentX - this.startX;
        const offsetY = currentY - this.startY;
        const targetNode = elm.parentNode.parentNode;
        // console.log("elm.tagName:" + elm.tagName + "/(offsetX:" + offsetX + "/offsetY:" + offsetY
        // + ")/(currentX:" + currentX + "/currentY:" + currentY
        // + ")/(this.startX:" + this.startX + "/this.startY:" + this.startY);
        targetNode.style.top = offsetY + "px";
        targetNode.style.left = offsetX + "px";
        this.offsetX = this.startX;
        this.offsetY = this.startY;
        this.offsetX１ = offsetX;
        this.offsetY１ = offsetY;
      }
    }
  }
}
