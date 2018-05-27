import idb from "../../util/idb/idbRapper";
import bc from "../../util/binaryConverter"
const title = "CopiBon";
const USER_ID = "default";
const PK_INCREMENT_STORE = "pk_increment";
const PK_ROW = "pk_row";
const titlePrefix = "title_";
const idbAccessors = new Map();
export default class StorageService {
  constructor(targetObj) {
    this.entityName = targetObj.getEntityName();
  }
  getStoreNameKey(targetObj, userId = USER_ID) {
    return userId + "_" + targetObj.getEntityName();
  }
  async createStore(targetObj, userId = USER_ID) {
    const storeNameKey = this.getStoreNameKey(targetObj, userId);
    const idbAccessor = idbAccessors.has(storeNameKey)
      ? idbAccessors.get(storeNameKey)
      : new idb(storeNameKey);
    idbAccessors.set(storeNameKey, idbAccessor);
    return idbAccessor;
  }
  async setStore(targetObj, userId = USER_ID) {
  console.log("A targetObj.getEntityName():"+targetObj.getEntityName()+"/this.idbAccessor:"+this.idbAccessor);
    this.idbAccessor = await this.createStore(targetObj, userId);
    console.log("B targetObj.getEntityName():"+targetObj.getEntityName()+"/this.idbAccessor:"+this.idbAccessor);
    return;
  }
  async save(pk, data) {
    let saveData = data;
    if (data.toObj) {
      saveData = data.toObj();
    }
    await this.idbAccessor.saveDataDefault(pk, saveData);
    return data;//
  }
  async loadAll(targetObj) {
    const list = await this.idbAccessor.loadAllData();
    if (targetObj && targetObj.deepClone && targetObj.load) {
      const retList = [];
      for (let row of list) {
        let cloned = targetObj.clone();
        cloned.load(row);
        retList.puhs(cloned);
      }
      return retList;
    } else {
      return list;
    }
  }
  async get(key) {
    console.log(this.idbAccessor+"/"+this.entityName);
    return await this.idbAccessor.loadData(key);
  }
  async delete(key) {
    return await this.idbAccessor.deleteData(key);
  }
  async acquirePKNo(userid = USER_ID, targetObj, rowKey = PK_ROW) {
    let currentObjectStore = await this.crateTitleStore(userid + "_" + PK_INCREMENT_STORE);
    console.log(currentObjectStore);
    let record = await this.get(rowKey);
    let nextCountAB = this.countUpUint32(record.data);
    let {data, keyPath} = await this.save(rowKey, record, (result, record) => {
      let nextCountAB = this.countUpUint32(record.data);
      result.data = nextCountAB;
    });
    return bc.arrayBuffer2base64(data);
  }
  countUpUint32(arrayBuffer) {
    let currentCount = arrayBuffer;
    if (!currentCount) {
      currentCount = new ArrayBuffer(4);
    }
    let dataview = new DataView(currentCount);
    let count = dataview.getUint32(0) | 0; // 0
    count++;
    dataview.setInt32(0, count >>> 0);
    return dataview.buffer;
  }
}
