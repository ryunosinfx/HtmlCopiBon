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
let pagesViewReducer = null;
export class PagesViewReducer extends BaseReducer {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.vpl = this.ms.getViewPartsLoader();
    this.em = this.ms.em;
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
  }
  static register() {
    if (!pagesViewReducer) {
      pagesViewReducer = new PagesViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.pageAddAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, 0, false);
    } else if (this.pageRemoveAction.type === action.type) {
      store[this.storeKey] = this.createProgress(false, 0, false);
    } else if (this.pagesResetAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, action.data.progress, false);
    } else if (this.pagesSortAction.type === action.type) {
      store[this.storeKey] = this.createProgress(true, 100, true);
    }
    return store;
  }
  async add(imagePk,pagePk){
    //
    await this.pp.add(imagePk,pagePk);
    return await this.pp.loadPages();
  }
  async remove(pagePk){
    //
    return await this.pp.loadPages();
  }
  async reset(){
    //
    return await this.pp.resetPages();
  }
  sort(formPk,toPk){
    //
  }
}
