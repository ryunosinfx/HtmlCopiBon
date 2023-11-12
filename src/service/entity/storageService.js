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
	async init(userId = USER_ID, targetObj) {
		if (!this.idbAccessor) {
			await this.setStore(userId, targetObj);
		}
	}
	async createStore(userId = USER_ID, targetObj = this.targetObj) {
		const storeNameKey = userId + '_' + targetObj.getEntityName();
		console.log('StorageService createStore storeNameKey:' + storeNameKey);
		return await idb.getAccessor(storeNameKey);
	}
	async setStore(userId = USER_ID, targetObj) {
		this.idbAccessor = await this.createStore(userId, targetObj);
	}
	async save(pk, data) {
		let saveData = data.toObj ? data.toObj() : data;
		await this.idbAccessor.put(pk, saveData);
		return data; //
	}
	async loadAll() {
		const list = await this.idbAccessor.getAll();
		const retList = [];
		for (const row of list) {
			retList.push(this.getEntity(row));
		}
		return retList;
	}
	async getAsMap(keys) {
		const pkList = [];
		for (const key of keys) {
			const pk = key && key.pk ? key.pk : key;
			pkList.push(pk);
		}
		const recordMap = await this.idbAccessor.getAsMap(pkList);
		const retMap = {};
		for (const key in recordMap) {
			const record = recordMap[key];
			retMap[key] = this.getEntity(record);
		}
		return retMap;
	}
	async get(key) {
		const pk = key && key.pk ? key.pk : key;
		const record = await this.idbAccessor.getRecord(pk);
		return this.getEntity(record);
	}
	getEntity(record) {
		if (!record || !record.data) {
			return record;
		}
		if (record.data && !this.targetObj.getEntityName) {
			return record.data;
		}
		const targetObj = new this.entityClass();
		targetObj.load(record.data);
		return targetObj;
	}
	async delete(key) {
		return await this.idbAccessor.delete(key);
	}
}
