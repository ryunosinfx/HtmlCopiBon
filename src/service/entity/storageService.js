import { idbw } from '../../../lib/ESIndexeddbWrapper.js';
import constant from './constant.js';
const USER_ID = 'default';
const PK_INCREMENT_STORE = 'pk_increment';
const idb = new idbw(constant.dbName);
export class StorageService {
	constructor(entityClass) {
		this.entityClass = entityClass;
		this.targetObj = typeof entityClass === 'string' ? entityClass : new entityClass();
		this.idbAccessor = null;
		this.entityName = this.targetObj.getEntityName ? this.targetObj.getEntityName() : entityClass;
	}
	async init(userId = USER_ID, targetObj = this.targetObj, closeTimeout) {
		if (!this.idbAccessor) await this.setStore(userId, targetObj), closeTimeout;
	}
	async createStore(userId = USER_ID, targetObj = this.targetObj, closeTimeout) {
		const storeNameKey = userId + '_' + targetObj.getEntityName();
		console.log('StorageService createStore storeNameKey:' + storeNameKey + ' /closeTimeout:' + closeTimeout);
		return await idb.getAccessor(storeNameKey, closeTimeout);
	}
	async setStore(userId = USER_ID, targetObj, closeTimeout) {
		this.idbAccessor = await this.createStore(userId, targetObj, closeTimeout);
	}
	async save(pk, data) {
		let saveData = data.toObj ? data.toObj() : data;
		await this.idbAccessor.put(pk, saveData);
		console.log('StorageService save pk:' + pk, data);
		return data; //
	}
	async loadAll() {
		const list = await this.idbAccessor.getAll(),
			retList = [];
		for (const row of list) retList.push(this.getEntity(row));
		return retList;
	}
	async getAsMap(keys) {
		const pkList = [];
		for (const key of keys) pkList.push(key && key.pk ? key.pk : key);
		const recordMap = await this.idbAccessor.getAsMap(pkList),
			retMap = {};
		for (const key in recordMap) retMap[key] = this.getEntity(recordMap[key]);
		return retMap;
	}
	async getRow(key) {
		const pk = key && key.pk ? key.pk : key,
			record = await this.idbAccessor.getRecord(pk);
		return this.getEntity(record);
	}
	getEntity(record) {
		if (!record || !record.data) return record;
		if (record.data && !this.targetObj.getEntityName) return record.data;
		const targetObj = new this.entityClass();
		targetObj.load(record.data);
		return targetObj;
	}
	async delete(key) {
		return await this.idbAccessor.delete(key);
	}
}
