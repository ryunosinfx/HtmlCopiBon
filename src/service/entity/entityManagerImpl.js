import {StorageService} from "./storageService"
import {Binary} from "./binary";
import {PrimaryKey} from "./primaryKey";
import {PrimaryKeyAutoIncrementService} from "./primaryKeyAutoIncrementService";
const title = "CopiBon";
const USER_ID = "default";
const titlePrefix = "title_";
const BINALY_PK_ROW = "BINALY_PK_ROW";
const entityManagerImpls = {};
const binaryEntity = new Binary();
export class EntityManagerImpl {
  constructor(entityManager, entityClass, userId = USER_ID) {
    this.userId = userId;
    this.entityClass = entityClass;
    this.entity = new entityClass();
    this.entityName = this.entity.getEntityName();
    this.ss = new StorageService(entityClass);
    this.pkais = new PrimaryKeyAutoIncrementService(userId);
    this.em = entityManager;
  }

  async init() {
    //console.log("init! "+this.entityName);
    return await this.ss.setStore(this.userId);
  }
  async save(data) {
    console.log("EntityManagerImpl save!!A!! data:" + data);
    if (!data || !data.getEntityName || !data.getPk || data.getEntityName() !== this.entityName) {
      console.log("EntityManagerImpl save!!Z!! data:" + data.getEntityName() + "/this.entityName:" + this.entityName + "/data.getPk:" + data.getPk);
      return;
    }
    let currentPK = data.getPk();
    if (!currentPK) {
      currentPK = PrimaryKey.assemblePK(this.entity, await this.pkais.acquirePKNo(this.userId, this.entity));
    }
    await this.saveArrayBufferCols(data);
    data.setPk(currentPK);
    console.log(data);
    const savedData = await this.ss.save(currentPK, data);
    console.log("EntityManagerImpl save!!B!! savedData:" + savedData);
    return savedData;
  }
  async saveArrayBufferCols(data){
    if(binaryEntity.getEntityName() === data.getEntityName()){
      return;
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
      } else if (column.byteLength) {
        const pk = await this.saveArrayBufferData(column);
        data[key] = new PrimaryKey(pk);
      }
    }
  }
  async saveArrayBufferData(item) {
    if (!item.getEntityName && item.byteLength) {
      const data = new Binary(item);
      const newPK = await this.getBinaryPK();
      data.setPk(newPK);
      await this.em.Binary.save(data);
      return newPK;
    } else if (item.getEntityName && item.getEntityName() === "PrimaryKey") {
      return item;
    } else if (item.getEntityName && item.getEntityName() === "Binary") {
      const currentPK = item.getPk();
      if (currentPK) {
        item.setPk(currentPK);
        await this.em.Binary.save(item);
        return currentPK;
      } else {
        const newPK = await this.getBinaryPK();
        item.setPk(newPK);
        await this.em.Binary.save(item);
        return newPK;
      }
    }
  }
  async getBinaryPK() {
    const newNumber = await this.pkais.acquirePKNo(this.userId, binaryEntity, BINALY_PK_ROW);
    return PrimaryKey.assemblePK(binaryEntity,newNumber);
  }
  async loadAll() {
    return await this.ss.loadAll(this.entity);
  }
  async get(pk) {
    console.log("get this.entityName:" + this.entityName + "/pk:" + pk);
    return await this.ss.get(pk, this.entity);
  }
  async delete(pk) {
    return await this.ss.delete(pk);
  }

}
