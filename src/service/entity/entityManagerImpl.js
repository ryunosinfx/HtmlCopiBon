import StorageService from "./storageService"
import Binary from "./binary";
import {PrimaryKey} from "./primaryKey";
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
    this.ss = new StorageService();
    this.ss.setStore(this.entity, this.userId);
  }

  async save(data) {
    if (!data.getEntityName || entity.getEntityName() !== this.entityName) {
      return;
    }
    let currentPK = data.getPK();
    if (!currentPK) {
      currentPK = PrimaryKey.assemblePK(this.entity,await this.ss.acquirePKNo(this.userId, data));
    }
    for (let key in data) {
      const column = data[key];
      if (!column) {
        continue;
      }
      if (Array.isArray(column)) {
        for (let index of column) {
          let item = column[index];
          if (!item) {
            continue;
          }
          let pk = await this.saveArrayBufferData(item);
          column[index] = new PrimaryKey(pk);
        }
      } else {
        let pk = await this.saveArrayBufferData(item);
        data[key] = new PrimaryKey(pk);
      }
    }
    await this.ss.save(currentPK, data);
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
    return PrimaryKey.assemblePK(binaryEntity,await this.ss.acquirePKNo(this.userId, data));
    return binaryEntity.getEntityName + "_" + await this.ss.acquirePKNo(this.userId, binaryEntity, BINALY_PK_ROW);
  }
  async loadAll() {
    return await loadAll(this.entity);
  }
  async get(pk) {
    return await this.ss.get(pk, this.entity);
  }
  async delete(pk) {
    return await this.ss.delete(pk);
  }

}
