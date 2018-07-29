import {
  SettingActionCreator
} from '../action/settingActionCreator'

import {
  Sorter
} from "../../util/sorter";
import {
  MainService
} from "../../service/mainService"
import {
  BaseReducer
} from '../../util/reactive/baseReducer'
let settingViewReducer = null;
export class SettingViewReducer extends BaseReducer {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.tm = this.ms.tm;
    this.sm = this.ms.sm;
    this.opm = this.ms.opm;
    this.creatAction = SettingActionCreator.creatAction();
    this.creatRemoveAction = SettingActionCreator.creatRemoveAction();
    this.creatLoadAction = SettingActionCreator.creatLoadAction();
    this.creatUpdateAction = SettingActionCreator.creatUpdateAction();
    this.atatch(this.creatAction);
    this.atatch(this.creatRemoveAction);
    this.atatch(this.creatLoadAction);
    this.atatch(this.creatUpdateAction);
    this.storeKey = SettingActionCreator.getStoreKey();
    this.storeKeyOpm = SettingActionCreator.getStoreKeyOpm();
  }
  static register() {
    if (!settingViewReducer) {
      settingViewReducer = new SettingViewReducer();
    }
  }
  async reduce(store, action) {
    if (this.creatAction.type === action.type) {
      store[this.storeKey] = await this.load().catch((e)=>{console.log(e)}) ;
      store[this.storeKeyOpm] = await this.opm.loadAll() ;
    } else if (this.creatRemoveAction.type === action.type) {
      store[this.storeKey] = await this.reset(action.data).catch((e)=>{console.log(e)});
      store[this.storeKeyOpm] = await this.opm.loadAll() ;
    } else if (this.creatLoadAction.type === action.type) {
      store[this.storeKey] = await this.load().catch((e)=>{console.log(e)}) ;
      store[this.storeKeyOpm] = await this.opm.loadAll() ;
    } else if (this.creatUpdateAction.type === action.type) {
      store[this.storeKey] = await this.update(action.data).catch((e)=>{console.log(e)});
      store[this.storeKeyOpm] = await this.opm.loadAll() ;
    }
  }
  async update(data) {
    const title = await this.tm.load();
    const pk = title.getPk();
    this.sm.save(pk, data.name, data.pageNum, data.startPage, data.pageDirection, data.outputProfile, data.listing);
    const settingEntityLoad = await this.sm.loadByPk(pk);
    if(!settingEntityLoad){
      const settingEntity =  await this.sm.createDefault(pk);
      return settingEntity;
    }
    return settingEntityLoad;
  }
  async reset() {
    const title = await this.tm.load();
    const pk = title.getPk();
    const settingEntity =  await this.sm.createDefault(pk);
    return settingEntity;
  }
  async load() {
    return this.tm.loadSettings();
  }
}
