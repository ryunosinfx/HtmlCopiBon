import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {Sorter} from "../../util/sorter";
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
import {ImageActionCreator} from '../../reduxy/action/imageActionCreator'
import {Thumbnail} from './thumbnail'
export class Thumbnails extends BaseView {
  constructor() {
    super("Thumnails", "Thumnails");
    this.imageAreaID = "thumnailsImageArea";
    this.thumbnails = {};
    this.thumbnail = new Thumbnail(this);
    this.ip = this.ms.ip;
  }
  onAfterAttach(store, data) {
    const action = ImageActionCreator.creatLoadImagesAction(this, {});
    this.dispatch(action);
  }
  async onViewShow(store, actionData) {
    if (store.imagesData) {
      await this.showImages(store.imagesData);
      console.log("Thumnails onViewShow");
    }
  }
  render(store, actionData) {
    return div(this.imageAreaID, "Thumnails");
  }
  async showImages(imageDatas) {
    const images = [];
    for (let imageData of imageDatas) {
      if (!imageData) {
        continue;
      }
      const imageEntity = imageData.imageEntity;
      const pk = imageEntity.getPk();
      let vnode = this.thumbnails[pk];
      if(!vnode){
        vnode = await this.thumbnail.crateDataLine(imageData).catch((e) => {
          console.log(e)
        })
        this.thumbnails[pk] = vnode;
      }
      images.push(vnode);
    }
    this.prePatch("#"+this.imageAreaID, div(this.imageAreaID, images));
  }
}
