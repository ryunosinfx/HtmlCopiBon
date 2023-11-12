import { EntityManagerImpl } from './entityManagerImpl.js';
import { Binary } from './binary.js';
import { ObjectUtil } from '../../util/objectUtil.js';
import { PrimaryKey } from './primaryKey.js';
const USER_ID = 'default';
export class EntityManager {
	constructor() {}
	async initAsNewUser(entities, userId = USER_ID) {
		console.log('EntityManager initAsNewUser', entities, userId);
		for (const entityClass of entities) {
			await this.initParEntity(entityClass, userId);
		}
		await this.initParEntity(Binary, userId);
	}
	async initParEntity(entityClass, userId) {
		console.log('EntityManager initParEntity 1', entityClass, userId);
		ObjectUtil.addBaseCLassese(entityClass);
		const entity = new entityClass(),
			entityName = entity.getEntityName(),
			i = new EntityManagerImpl(this, entityClass, userId);
		this[entityName] = i;
		console.log('EntityManager initParEntity 2', entityClass, userId);
		await i.init();
	}
	isPrimaryKey(item) {
		return item && item.getEntityName() === 'PrimaryKey';
	}
	async getAsMap(keys) {
		if (!keys || keys.length < 1) {
			console.error('keys:' + keys);
			alert('keys:' + keys);
			return null;
		}
		const pk = keys[0];
		const truePk = PrimaryKey.getPrimaryKey(pk);
		if (!PrimaryKey.isPrimaryKey(truePk)) {
			console.log(truePk);
			return null;
		}
		const entityName = PrimaryKey.getEntityName(truePk);
		// console.log("★get entityName:"+entityName+truePk);
		return await this[entityName].getAsMap(keys, this.entity);
	}
	async get(pk) {
		if (!pk) {
			console.error('pk:' + pk);
			alert('pk:' + pk);
			return null;
		}
		const truePk = PrimaryKey.getPrimaryKey(pk);
		if (!PrimaryKey.isPrimaryKey(truePk)) {
			console.log(truePk);
			return null;
		}
		const entityName = PrimaryKey.getEntityName(truePk);
		// console.log("★get entityName:"+entityName+truePk);
		return await this[entityName].get(truePk);
	}
	async delete(pk) {
		if (!pk) {
			alert(pk);
			return null;
		}
		const entityName = PrimaryKey.getEntityName(pk);
		// console.log("★remove entityName:"+entityName);
		return await this[entityName].delete(pk);
	}
}
