import { EntityManagerImpl } from './entityManagerImpl.js';
import { Binary } from './binary.js';
import { ObjectUtil } from '../../util/objectUtil.js';
import { PrimaryKey } from './primaryKey.js';
const USER_ID = 'default';
export class EntityManager {
	constructor() {}
	async initAsNewUser(entities, userId = USER_ID) {
		console.log('EntityManager initAsNewUser', entities, userId);
		for (const entityClass of entities) await this.initParEntity(entityClass, userId);
		await this.initParEntity(Binary, userId, 30000);
	}
	async initParEntity(entityClass, userId, closeTimeout) {
		console.log('EntityManager initParEntity 1', entityClass, userId);
		ObjectUtil.addBaseCLassese(entityClass);
		const entity = new entityClass(),
			entityName = entity.getEntityName(),
			i = new EntityManagerImpl(this, entityClass, userId, closeTimeout);
		this[entityName] = i;
		console.log('EntityManager initParEntity 2', entityClass, userId);
		await i.init();
	}
	isPrimaryKey(item) {
		return item && item.getEntityName() === 'PrimaryKey';
	}
	async getAsMap(keys) {
		if (!keys || keys.length < 1) return console.error('keys:' + keys) || alert('keys:' + keys) ? null : 0;
		const pk = keys[0];
		const truePk = PrimaryKey.getPrimaryKey(pk);
		if (!PrimaryKey.isPrimaryKey(truePk)) return console.log(truePk) ? 0 : null;
		const entityName = PrimaryKey.getEntityName(truePk);
		// console.log("★get entityName:"+entityName+truePk);
		return await this[entityName].getAsMap(keys, this.entity);
	}
	async get(pk) {
		if (!pk) return console.error('pk:' + pk) || alert('pk:' + pk) ? null : 0;
		const truePk = PrimaryKey.getPrimaryKey(pk);
		if (!PrimaryKey.isPrimaryKey(truePk)) return console.log(truePk) ? 0 : null;
		const entityName = PrimaryKey.getEntityName(truePk);
		// console.log("★get entityName:"+entityName+truePk);
		return await this[entityName].get(truePk);
	}
	async delete(pk) {
		if (!pk) return alert('pk is null! pk:' + pk) ? null : 0;
		const entityName = PrimaryKey.getEntityName(pk);
		// console.log("★remove entityName:"+entityName);
		return await this[entityName].delete(pk);
	}
}
