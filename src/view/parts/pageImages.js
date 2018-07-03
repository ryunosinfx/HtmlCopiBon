import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class PageImages  extends BaseView {
  constructor() {
    super("PageImages", "PageImages");
    this.thumbnails = {};
  }
  render() {
    this.setting = div(this.id+"child", ["PageImagesA"], this.id);
    return div(this.id, "PageImages", [this.setting]);
  }
  async onViewShow(store, actionData) {
    if (store.imagesData) {
      await this.showImages(store.imagesData);
      console.log("Thumnails onViewShow");
    }
  }
  async showImages(imageDatas) {
    const images = [];
    for (let imageData of imageDatas) {
      if (!imageData || !imageData.isOnPage) {
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
