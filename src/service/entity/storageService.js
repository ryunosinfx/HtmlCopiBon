import idb from "../../util/idb/idbRapper";
const USER_ID = "default";
const PK_INCREMENT_STORE = "pk_increment";
const idbAccessors = new Map();
export default class StorageService {
  constructor(targetObj) {
    this.targetObj = targetObj;
    this.idbAccessor = null;
    this.entityName = targetObj.getEntityName
      ? targetObj.getEntityName()
      : targetObj;
  }
  getStoreNameKey(targetObj, userId = USER_ID) {
    return userId + "_" + targetObj.getEntityName();
  }
  async createStore(targetObj, userId = USER_ID) {
    const storeNameKey = this.getStoreNameKey(targetObj, userId);
    return await this.createStoreByName(storeNameKey, userId);
  }
  async createStoreByName(storeNameKey, userId = USER_ID) {
    const idbAccessor = idbAccessors.has(storeNameKey)
      ? idbAccessors.get(storeNameKey)
      : new idb(storeNameKey);
    //console.log("C");
    await idbAccessor.init().catch((e) => {
      console.log(e)
    });
    //console.log("D");
    idbAccessors.set(storeNameKey, idbAccessor);
    this.idbAccessor = idbAccessor;
    return idbAccessor;
  }
  async setStore(targetObj, userId = USER_ID) {
    //console.log("A targetObj.getEntityName():" + targetObj.getEntityName() + "/this.idbAccessor:" + this.idbAccessor);
    this.idbAccessor = await this.createStore(targetObj, userId);
    //console.log("B targetObj.getEntityName():" + targetObj.getEntityName() + "/this.idbAccessor:" + this.idbAccessor);
    return;
  }
  async save(pk, data) {
    //console.log("save!!!! data:" + data + "/pk:" + pk + "/this.entityName:" + this.entityName);
    let saveData = data;
    if (data.toObj) {
      saveData = data.toObj();
    }
    await this.idbAccessor.saveDataDefault(pk, saveData);
    //console.log("save!!! data:" + data + "/this.entityName:" + this.entityName);
    return data; //
  }
  async loadAll() {
    const list = await this.idbAccessor.loadAllData();
    const retList = [];
    for (let row of list) {
      const cloned = this.getEntity(row);
      retList.puhs(cloned);
    }
    return retList;
  }
  async get(key) {
    //console.log(this.idbAccessor + "/" + this.entityName);
    const pk = key && key.pk
      ? key.pk
      : key;
    const record = await this.idbAccessor.loadData(pk);
    return this.getEntity(record);
  }
  getEntity(record) {
    if (!record || !record.data) {
      return record;
    }
    if (record.data && !this.targetObj.create) {
      return record.data;
    }
    const targetObj = this.targetObj.create();
    console.log(targetObj);
    targetObj.load(record.data);
    return targetObj;
  }
  async delete(key) {
    return await this.idbAccessor.deleteData(key);
  }
}
