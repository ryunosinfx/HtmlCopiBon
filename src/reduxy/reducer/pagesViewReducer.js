import {
  PageActionCreator
} from '../action/pageActionCreator'
import {
  MainService
} from "../../service/mainService"
import {
  BaseReducer
} from '../../util/reactive/baseReducer'
import {PageProcessor} from '../processor/pageProcessor'
import {ImageActionCreator} from '../action/imageActionCreator'
let pagesViewReducer = null;
export class PagesViewReducer extends BaseReducer {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.vpl = this.ms.getViewPartsLoader();
    this.em = this.ms.em;
    this.im = this.ms.im;
    this.tm = this.ms.tm;
    this.pageAddAction = PageActionCreator.creatAddPageAction();
    this.pageRemoveAction = PageActionCreator.creatRemovePageAction();
    this.pagesResetAction = PageActionCreator.creatResetPagesAction();
    this.pagesSortAction = PageActionCreator.creatSortPagesAction();
    this.atatch(this.pageAddAction);
    this.atatch(this.pageRemoveAction);
    this.atatch(this.pagesResetAction);
    this.atatch(this.pagesSortAction);

    this.pp = new PageProcessor();
    this.storeKey = PageActionCreator.getStorePagesKey();
    this.storeImagesKey = ImageActionCreator.getStoreImagesKey();
  }
  static register() {
    if (!pagesViewReducer) {
      pagesViewReducer = new PagesViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.pageAddAction.type === action.type) {
      store[this.storeKey] = await this.add(action.data.imagePk,action.data.pagePk);
      store[this.storeImagesKey] = await this.loadImages();
    } else if (this.pageRemoveAction.type === action.type) {
      store[this.storeKey] = this.remove(action.data.pagePk);
      store[this.storeImagesKey] = await this.loadImages();
    } else if (this.pagesResetAction.type === action.type) {
      store[this.storeKey] = this.reset();
      store[this.storeImagesKey] = await this.loadImages();
    } else if (this.pagesSortAction.type === action.type) {
      store[this.storeKey] = this.move(action.data.formPk,action.data.toPk);
    }
    return store;
  }
  async loadImages(){
    return await this.im.loadImages();
  }
  async add(imagePk,pagePk){
    //
    await this.pp.add(imagePk,pagePk);
    return await this.pp.loadPages();
  }
  async remove(pagePk){
    //
    await this.pp.remove(pagePk);
    return await this.pp.loadPages();
  }
  async reset(){
    //
    return await this.pp.resetPages();
  }
  async move(formPk,toPk){
    //
    await this.pp.move(formPk,toPk);
    return await this.pp.loadPages();
  }
}
