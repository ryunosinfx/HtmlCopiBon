import StorageService from "./storageService"
import Binary from "./binary";
import {PrimaryKey} from "./primaryKey";
import PrimaryKeyAutoIncrementService from "./primaryKeyAutoIncrementService";
const title = "CopiBon";
const USER_ID = "default";
const titlePrefix = "title_";
const BINALY_PK_ROW = "BINALY_PK_ROW";
const entityManagerImpls = {};
const binaryEntity = new Binary();
export default class EntityManagerImpl {
  constructor(entity, userId = USER_ID) {
    this.userId = userId;
    this.entity = entity;
    this.entityName = entity.getEntityName();
    this.ss = new StorageService(this.entity);
    this.pkais = new PrimaryKeyAutoIncrementService(userId);
  }

  async init(){
    //console.log("init! "+this.entityName);
    return await this.ss.setStore(this.entity, this.userId);
  }
  async save(data) {
    console.log("EntityManagerImpl save!!A!! data:"+data);
    if (!data || !data.getEntityName || ! data.getPk || data.getEntityName() !== this.entityName) {
      console.log("EntityManagerImpl save!!Z!! data:"+data.getEntityName()+"/this.entityName:"+this.entityName+"/data.getPk:"+data.getPk);
      return;
    }
    let currentPK = data.getPk();
    if (!currentPK) {
      currentPK = PrimaryKey.assemblePK(this.entity,await this.pkais.acquirePKNo(this.userId, this.entity));
    }
    for (let key in data) {
      const column = data[key];
      if (!column) {
        continue;
      }
      if (Array.isArray(column)) {
        for (let index of column) {
          const item = column[index];
          if (!item || item.byteLength) {
            continue;
          }
          const pk = await this.saveArrayBufferData(item);
          column[index] = new PrimaryKey(pk);
        }
      } else if(column.byteLength){
        const pk = await this.saveArrayBufferData(column);
        data[key] = new PrimaryKey(pk);
      }
    }
    data.setPk(currentPK);
    console.log(data);
    const savedData = await this.ss.save(currentPK, data);
      console.log("EntityManagerImpl save!!B!! savedData:"+savedData);
    return savedData;
  }
  async saveArrayBufferData(item) {
    if (!item.getEntityName && item.byteLength) {
      let data = new Binary(item);
      const newPK = await this.getBinaryPK();
      await this.ss.save(newPK, item);
      return newPK;
    } else if (item.getEntityName && item.getEntityName() === "PrimaryKey") {
      return item;
    } else if (item.getEntityName && item.getEntityName() === "Binary") {
      const currentPK = item.getPk();
      if (currentPK) {
        await this.ss.save(currentPK, item);
        return currentPK;
      } else {
        const newPK = await this.getBinaryPK();
        await this.ss.save(newPK, item);
        return newPK;
      }
    }
  }
  async getBinaryPK() {
    //return PrimaryKey.assemblePK(binaryEntity,await this.ss.acquirePKNo(this.userId, data));
    return binaryEntity.getEntityName() + "_" + await this.pkais.acquirePKNo(this.userId, binaryEntity, BINALY_PK_ROW);
  }
  async loadAll() {
    return await loadAll(this.entity);
  }
  async get(pk) {
    console.log("get this.entityName:"+this.entityName+"/pk:"+pk);
    return await this.ss.get(pk, this.entity);
  }
  async delete(pk) {
    return await this.ss.delete(pk);
  }

}
