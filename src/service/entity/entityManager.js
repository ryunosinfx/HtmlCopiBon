import StorageService from "./storageService"
import EntityManagerImpl from "./entityManagerImpl"
import Binary from "./binary";
import {PrimaryKey} from "./primaryKey";
const USER_ID = "default";
export default class EntityManager {
  constructor() {}
  async initAsNewUser(entities, userId = USER_ID) {
    console.log(entities);
    const promises = [];
    for (let entityClass of entities) {
      await this.initParEntity(entityClass, userId);
    }
    await this.initParEntity(Binary, userId);
  }
  async initParEntity(entityClass, userId) {
    const entity = new entityClass();
    const entityName = entity.getEntityName();
    this[entityName] = new EntityManagerImpl(this, entityClass, userId);
    await this[entityName].init();
  }
  isPrimaryKey(item) {
    if (item && item.getEntityName() === 'PrimaryKey') {
      return true;
    }
    return false;
  }
  async get(pk) {
    if(!pk){
      alert(pk);
      return null;
    }
    const entityName = PrimaryKey.getEntityName(pk);
    console.log("★get entityName:"+entityName);
    return await this[entityName].get(pk);
  }
  async delete(pk) {
    if(!pk){
      alert(pk);
      return null;
    }
    const entityName = PrimaryKey.getEntityName(pk);
    console.log("★remove entityName:"+entityName);
    return await this[entityName].delete(pk);
  }
}
