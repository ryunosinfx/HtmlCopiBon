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
    this.storeImagesKey = ImageActionCreator.getStoreImagesKey();
    this.pageMap = {}
    this.thumbnails_block = 'thumbnails_block';
    this.draggableArea = draggableArea;
    this.draggableArea.cancelPageArea = null;
  }
  async onAfterAttach(store, data) {
    const action = ImageActionCreator.creatLoadImagesAction(this, {});
    await this.dispatch(action);
  }
  async onViewShow(store, actionData) {
    const pagesData = store[this.storePagesKey];
    const imagesData = store[this.storeImagesKey];
    if (imagesData && pagesData) {
      this.updatePageMap(pagesData);
      await this.showImages(imagesData).catch((e) => {
        console.error(e)
      });;
      // console.error("Thumnails onViewShow count:"+pagesData.length+"/"+imagesData.length+"/"+JSON.stringify(this.pageMap));
    }
  }
  render(store, actionData) {
    return div(this.imageAreaID, "Thumnails");
  }
  updatePageMap(pagesData) {
    for (let key in this.pageMap) {
      delete this.pageMap[key];
    }
    for (let pageEntity of pagesData) {
      const imagePk = pageEntity.baseImage;
      if (imagePk) {
        this.pageMap[imagePk] = true;
      }
    }
  }
  handleDragEnter() {
    return(event) => {
      const elm = event.target;
      if (!elm.classList || !elm.classList.contains(this.thumbnails_block)) {
        return
      }
      elm.classList.add('over');
      this.draggableArea.cancelPageArea = elm;
    }
  }
  handleDragLeave() {
    return(event) => {
      const elm = event.target;
      if (!elm.classList || !elm.classList.contains(this.thumbnails_block)) {
        return
      }
      elm.classList.remove('over'); // this / event.target is previous target element.
      setTimeout(() => {
        this.draggableArea.cancelPageArea = null;
      }, 100)
    }
  }
  handleDrop(event) {
    return(event) => {
      event.stopPropagation(); // Stops some browsers from redirecting.
      event.preventDefault();
      const elm = event.target;
      return false;
    }
  }

  reset() {
    return(event) => {
      const elm = event.target;
      //alert("reset!")
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
      const vnode = await this.thumbnail.crateDataLine(imageData, this.pageMap).catch((e) => {
        console.error(e)
      });
      images.push(vnode);
    }
    const newVnode = div(this.imageAreaID, [this.thumbnails_block], {
      on: {
        dragover: this.handleDragEnter(),
        dragstart: this.handleDragEnter(),
        dragenter: this.handleDragEnter(),
        dragleave: this.handleDragLeave(),
        drop: this.handleDrop(),
        dragend: this.handleDrop(),
        click: this.reset()
      },
      props: {
        "draggable": "true"
      }
    }, images)
    this.prePatch("#" + this.imageAreaID, newVnode);
  }
}
