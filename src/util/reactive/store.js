import {ObjectUtil} from '../objectUtil';

const mainHolder = new Map();
const mainKey = 'aaa';
export class Store {
  constructor(service) {
  }
  static getStore(key) {
    const newKey = key ? key : mainKey;
    const store = mainHolder.has(newKey) ? mainHolder.get(newKey) : null;
    const clonedStore = store ? ObjectUtil.simpleDeepClone(store) : {};
    clonedStore['oldVnode'] = store ?store['oldVnode']: null;
    return clonedStore;
  }
  static setStore(store, key) {
    const newKey = key ? key : mainKey;
    const clonedStore = store ? ObjectUtil.simpleDeepClone(store) : {};
    clonedStore['oldVnode'] = store ?store['oldVnode']:null;
    mainHolder.set(newKey, clonedStore);
  }
}
