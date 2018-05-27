import StorageService from "./storageService"
import EntityManagerImpl from "./entityManagerImpl"
import Binary from "./binary";
const USER_ID = "default";
const binaryEntity = new Binary();
export default class EntityManager {
  constructor() {
  }
  initAsNewUser(entities, userId = USER_ID) {
    console.log(entities);
    const promises = [];
    for (let entity of entities) {
      promises.push(this.initParEntity(entity, userId));
    }
    promises.push(this.initParEntity(binaryEntity, userId));
    return Promise.all(promises);
  }
  async initParEntity(entity, userId) {
    const entityName = entity.getEntityName();
    this[entityName] = new EntityManagerImpl(entity, userId);
    await this[entityName].init();
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
