import StorageService from "./storageService"
import EntityManagerImpl from "./entityManagerImpl"
import Binary from "./binary";
const USER_ID = "default";
const binaryEntity = new Binary();
export default class EntityManager {
  constructor() {
    this.ss = new StorageService();
  }
  initAsNewUser(entities, userId = USER_ID) {
    const promises = [];
    for (let entity of entities) {
      promises.push(this.initParEntity(entity, userId));
    }
    promises.push(this.initParEntity(binaryEntity, userId));
    return Promise.all(promises);
  }
  initParEntity(entity, userId) {
    this[entity] = new EntityManagerImpl(entity, userId);
    return this.ss.createStore(entity, userId);
  }
  isPrimaryKey(item){
    if(item && item.getEntityName() === 'PrimaryKey'){
      return true;
    }
    return false;
  }
  get(pk){

  }
}
