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
import {PageActionCreator} from '../../reduxy/action/pageActionCreator'
import {Thumbnail} from './thumbnail'
export class Thumbnails extends BaseView {
  constructor(draggableArea) {
    super("Thumnails", "Thumnails");
    this.imageAreaID = "thumnailsImageArea";
    this.thumbnail = new Thumbnail(this, draggableArea);
    this.ip = this.ms.ip;
    this.storePagesKey = PageActionCreator.getStorePagesKey();
    this.pageMap= {}
  }
  onAfterAttach(store, data) {
    const action = ImageActionCreator.creatLoadImagesAction(this, {});
    this.dispatch(action);
  }
  async onViewShow(store, actionData) {
    const pagesData = store[this.storePagesKey];
    if (store.imagesData && pagesData) {
      this.updatePageMap(pagesData);
      await this.showImages(store.imagesData);
      // console.log("Thumnails onViewShow");
    }
  }
  render(store, actionData) {
    return div(this.imageAreaID, "Thumnails");
  }
  updatePageMap(pagesData) {
    for(let key in this.pageMap){
      delete this.pageMap[key];
    }
    for(let pageEntity of pagesData){
      const imagePk = pageEntity.baseImage;
      if(imagePk){
        this.pageMap[imagePk] = true;
      }
    }
  }
  async showImages(imageDatas) {
    const images = [];
    for (let imageData of imageDatas) {
      if (!imageData) {
        continue;
      }
      const imageEntity = imageData.imageEntity;
      const pk = imageEntity.getPk();
      const vnode = await this.thumbnail.crateDataLine(imageData,this.pageMap).catch((e) => {
          console.log(e)
        });
      images.push(vnode);
    }
    this.prePatch("#" + this.imageAreaID, div(this.imageAreaID, images));
  }
}
