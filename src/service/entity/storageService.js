import idb from "../../util/idb/idbRapper";
const USER_ID = "default";
const PK_INCREMENT_STORE = "pk_increment";
const idbAccessors = new Map();
export default class StorageService {
  constructor(entityClass) {
    this.entityClass = entityClass;
    this.targetObj = typeof entityClass === "string" ? entityClass: new entityClass();
    this.idbAccessor = null;
    this.entityName = this.targetObj.getEntityName
      ? this.targetObj.getEntityName()
      : entityClass;
  }
  getStoreNameKey(userId = USER_ID) {
    return userId + "_" + this.targetObj.getEntityName();
  }
  async createStore(userId = USER_ID) {
    const storeNameKey = this.getStoreNameKey(userId);
    return await this.createStoreByName(storeNameKey, userId);
  }
  async createStoreByName(storeNameKey, userId = USER_ID) {
    const idbAccessor = idbAccessors.has(storeNameKey)
      ? idbAccessors.get(storeNameKey)
      : new idb(storeNameKey);
    await idbAccessor.init().catch((e) => {
      console.log(e)
    });
    idbAccessors.set(storeNameKey, idbAccessor);
    this.idbAccessor = idbAccessor;
    return idbAccessor;
  }
  async setStore(userId = USER_ID) {
    this.idbAccessor = await this.createStore(userId);
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
    if (record.data && !this.targetObj.getEntityName) {
      return record.data;
    }
    const targetObj = new this.entityClass();
    console.log(targetObj);
    targetObj.load(record.data);
    console.log(targetObj.getPk());
    return targetObj;
  }
  async delete(key) {
    return await this.idbAccessor.deleteData(key);
  }
}
