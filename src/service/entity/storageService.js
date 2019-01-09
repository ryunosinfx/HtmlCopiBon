import { indexedbwrapper } from "indexedbwrapper";
import constant from './constant'
const USER_ID = "default";
const PK_INCREMENT_STORE = "pk_increment";
const idb = new indexedbwrapper(constant.dbName);
export class StorageService {
	constructor(entityClass) {
		this.entityClass = entityClass;
		this.targetObj = typeof entityClass === "string" ? entityClass : new entityClass();
		this.idbAccessor = null;
		this.entityName = this.targetObj.getEntityName ?
			this.targetObj.getEntityName() :
			entityClass;
	}
	async createStore(userId = USER_ID) {
		const storeNameKey = userId + "_" + this.targetObj.getEntityName();
		return await await idb.getObAccessor(storeNameKey);
	}
	async setStore(userId = USER_ID) {
		this.idbAccessor = await this.createStore(userId);
		return;
	}
	async save(pk, data) {
		let saveData = data;
		if (data.toObj) {
			saveData = data.toObj();
		}
		// console.log(saveData);
		await this.idbAccessor.put(pk, saveData);
		return data; //
	}
	async loadAll() {
		const list = await this.idbAccessor.getAll();
		const retList = [];
		for (let row of list) {
			const cloned = this.getEntity(row);
			retList.push(cloned);
		}
		return retList;
	}
	async getAsMap(keys) {
		const pkList = [];
		for (let key of keys) {
			const pk = key && key.pk ?
				key.pk :
				key;
			pkList.push(pk);
		}
		const recordMap = await this.idbAccessor.getAsMap(pkList);
		const retMap = {};
		for (let key in recordMap) {
			const record = recordMap[key];
			retMap[key] = this.getEntity(record);
		}
		return retMap;
	}
	async get(key) {
		const pk = key && key.pk ?
			key.pk :
			key;
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