import {
  ActionCreator
} from '../../util/reactive/actionCreator'
import {
  ImageActionCreator
} from '../action/imageActionCreator'

import {MainService} from "../../service/mainService"
import BaseReducer from '../../util/reactive/baseReducer'
export default class ImageViewReducer extends BaseReducer {
  constructor(ms) {
    super(ms);
    this.imagAddAction = ImageActionCreator.creatAddAction();
    this.imageRemoveAction = ImageActionCreator.creatRemoveAction();
    this.imagesLoadAction = ImageActionCreator.creatLoadImagesAction();
    this.imagesSortAction = ImageActionCreator.creatSortImagesAction();
    this.atatch(this.imagAddAction);
  }
  async reduce(store, action) {
    if (this.imagAddAction.type === action.type) {
      //todo db add
    } else if (this.imageRemoveAction.type === action.type) {
      //todo db add
    } else if (this.imagesLoadAction.type === action.type) {
      //todo db add
    } else if (this.imagesSortAction.type === action.type) {
      //todo db add
    }
    return store;
  }
}
const imageViewReducer = new ImageViewReducer();
