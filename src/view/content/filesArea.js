import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
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
import {ImageDetail} from "../parts/imageDetail";
import {PageImages} from "../parts/pageImages";
import {Thumbnails} from "../parts/thumbnails";
import {
  ImageViewReducer
} from '../../reduxy/reducer/imageViewReducer'
export class FilesArea extends BaseView {
  constructor() {
    super("FilesArea", "FilesArea");
    this.imageDetail = new ImageDetail();
    this.pageImages = new PageImages();
    this.thumbnails = new Thumbnails();
    ImageViewReducer.register();
  }

  onAfterAttach(store, data) {
    this.imageDetail.attach(this);
    this.pageImages.attach(this);
    this.thumbnails.attach(this);
  }
  render() {
    return div("", [
      div(this.pageImages.id),
      div(this.thumbnails.id),
        div(this.imageDetail.id)
    ])

  }
}
