import constant from './constant'
import { IndexeddbHelper } from './indexeddbHelper'
const initQueue = [];
export default class IdbRapper {

	constructor(objectStoreName, keypathName = "pk") {
		if (constant.idbh === undefined) {
			constant.idbh = new IndexeddbHelper(constant.dbName);
		}
		this.idbh = constant.idbh;
		this.keyPathName = keypathName;
		this.objectStoreName = objectStoreName;
		//tableName, keyPathName
	}
	init() {
		return new Promise((reslve, reject) => {
			this.idbh.createStore(this.objectStoreName, this.keyPathName)
				.then(() => {
					reslve(true)
				}, (e) => {
					reject(e);
					throw e;
				});
		});
	}
	isFished() {
		return new Promise((reslve, reject) => {
			this.firstPromise.then(() => {
				reslve(true);
			}, (e) => {
				throw e;
			})
		});
	}
	async saveDataDefault(key, data, callback) {
		let record = {
			pk: key,
			data: data
		};
		//console.log("saveDataDefault 001:" + key + "/" + data);
		await this.saveData(record, undefined, callback);
		//console.log("saveDataDefault 002:" + key + "/" + data);
	}
	async saveData(dataObj, key, callback) {
		//console.log("saveData 001:" + key + "/" + JSON.stringify(dataObj)+"/dataObj.data:"+dataObj.data);
		let storeData = dataObj;
		//console.log("saveData 002:" + key + "/" + dataObj[this.keyPathName]);
		if (dataObj[this.keyPathName] === undefined) {
			storeData = {
				data: dataObj
			};
			storeData[this.keyPathName] = key;
		} else if (key !== undefined) {}
		//console.log("saveData 003:" + key + "/" + dataObj +"/this.objectStoreName:"+this.objectStoreName);
		let value = await this.idbh.insertUpdate(this.objectStoreName, this.keyPathName, storeData, callback);
		//console.log("saveData 004:" + key + "/" + dataObj+"/"+JSON.stringify(value)+"/"+value.data.data);
	}
	async loadDataMap(keys) {
		if (keys !== undefined) {
			let recordAsLoadedData = await this.idbh.selectByKeys(this.objectStoreName, keys);
			return recordAsLoadedData;
		}
		return null;
	}
	async loadData(key) {
		if (key !== undefined) {
			let recordAsLoadedData = await this.idbh.selectByKey(this.objectStoreName, key);
			return recordAsLoadedData;
		}
		return null;
	}
	async loadDataDefault(key) {
		let recordAsDefaultLoad = await this.loadData(key);
		return recordAsDefaultLoad === undefined || recordAsDefaultLoad === null ?
			null :
			recordAsDefaultLoad.data;
	}
	async loadAllData() {
		return await this.idbh.selectAll(this.objectStoreName);
	}
	async deleteData(key) {
		if (key !== undefined) {
			return await this.idbh.delete(this.objectStoreName, key);
		}
		return null;
	}
	async getOsNames() {
		return await this.idbh.getObjectStoreNames();
	}
}
