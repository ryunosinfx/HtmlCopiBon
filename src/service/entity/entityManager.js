import StorageService from "./storageService"
import EntityManagerImpl from "./entityManagerImpl"
import Binary from "./binary";
const USER_ID = "default";
const binaryEntity = new Binary();
export default class EntityManager {
  constructor() {}
  async initAsNewUser(entities, userId = USER_ID) {
    console.log(entities);
    const promises = [];
    for (let entity of entities) {
      await this.initParEntity(entity, userId);
    }
    await this.initParEntity(binaryEntity, userId);
  }
  async initParEntity(entity, userId) {
    const entityName = entity.getEntityName();
    this[entityName] = new EntityManagerImpl(this, entity, userId);
    await this[entityName].init();
  }
  isPrimaryKey(item) {
    if (item && item.getEntityName() === 'PrimaryKey') {
      return true;
    }
    return false;
  }
  get(pk) {}
}
