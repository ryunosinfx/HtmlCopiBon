import vu from "../../util/viewUtil";
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
import {
  SettingActionCreator
} from '../../reduxy/action/settingActionCreator'
export class PageImages extends BaseView {
  constructor() {
    super("PageImages", "PageImages");
    this.storeKey = SettingActionCreator.getStoreKey();
    this.thumbnails = {};
  }
  render() {
    this.setting = div(this.id + "child", ["PageImagesA"], this.id);
    return div(this.id, "PageImages", [this.setting]);
  }
  async onViewShow(store, actionData) {
    if (store[this.storeKey]) {
      this.buildPageFrames(store[this.storeKey]);
    }
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
      if (!vnode) {
        vnode = await this.thumbnail.crateDataLine(imageData).catch((e) => {
          console.log(e)
        })
        this.thumbnails[pk] = vnode;
      }
      images.push(vnode);
    }
    this.prePatch("#" + this.imageAreaID, div(this.imageAreaID, images));
  }
  buildPageFrames(settings) {
    const frames = [];
    const startPage = setting.startPage;
    const pageNum = setting.pageNum;
    const pageDirection = setting.pageDirection;
    const frameNum = Math.ceil(pageNum/2);
    const isOdd =(pageNum % 2 === 1);
    const isMatchPageStartSide = (pageDirection.indexOf(startPage)===0);
    const addPageNum = isOdd?0:isMatchPageStartSide?0:2;
    const totalPageFrame = frameNum+addPageNum;
    for(let index = 0;index < totalPageFrame;index++){
      
    }
  }
}
