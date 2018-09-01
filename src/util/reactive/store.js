import {ObjectUtil} from '../objectUtil';

const mainHolder = new Map();
const subHolder = new Map();
const mainKey = 'aaa';
const tempStore = null;
export class Store {
  constructor(service) {}
  static cloneStore(store,action){
    subHolder.set(action,store)
    return ObjectUtil.simpleDeepClone(store);
  }
  static getTemp(newKey = mainKey, action){
    const store = subHolder.has(action)
      ? subHolder.get(action)
      : null;
    return store;
  }
  static getStore(newKey = mainKey, actionClass) {
    const store = mainHolder.has(newKey)
      ? mainHolder.get(newKey)
      : null;
    // copy
    const clonedStore = store
      ? ObjectUtil.simpleDeepClone(store)
      : {};
    clonedStore['oldVnode'] = store
      ? store['oldVnode']
      : null;
    return clonedStore;
  }
  static setStore(store, newKey = mainKey, actionClass) {
    const clonedStore = store
      ? ObjectUtil.simpleDeepClone(store)
      : {};
    const storeAtCurrent = mainHolder.has(newKey)
      ? mainHolder.get(newKey)
      : null;
    for (let index in storeAtCurrent) {
      const inputValue = clonedStore[index];
      const currentValue = storeAtCurrent[index];
      if (inputValue || (inputValue !== null && inputValue !== undefined)) {
        storeAtCurrent[index] = inputValue;
      }
    }
    for (let index in storeAtCurrent) {
      const inputValue = clonedStore[index];
      const currentValue = storeAtCurrent[index];
      if (!inputValue && inputValue !== null && currentValue) {
        clonedStore[index] = currentValue;
      }
    }
    clonedStore['oldVnode'] = store
      ? store['oldVnode']
      : null;
    mainHolder.set(newKey, clonedStore);
  }
}
