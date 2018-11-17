import { IdbUtil } from './idbUtil'
import { IndexeddbCore } from './indexeddbCore'
const MODE_R = "readonly";
const MODE_RW = "readwrite";
export default class IndexeddbHelper {
	constructor(dbName) {
		this.core = new IndexeddbCore();
		this.IDBKeyRange = window.IDBKeyRange;
		this.indexedDB = window.indexedDB;
		this.dbName = dbName;
		this.keyPathMap = {};
		this.db = null;
		this.lastVersion = null;
		this.isUpdateOpen = false;
		this.timer = null;
		this.isDBClosed = true;
		this.tableCache = {};
	}
	//public
	async selectAll(payload) {
		return await this.core.selectAll(payload);
	}
	//Select In-line-Keyで返す。
	async _selectAll(tableName, range, direction) {
		return await this.core._selectAll(tableName, range, direction);
	};
	async selectByKey(payload) {
		return await this.core.selectByKey(payload);
	}
	//Select In-line-return promise;Keyで返す。
	async _selectByKey(tableName, key) {
		return await this.core._selectByKey(tableName, key);
	}
	async selectByKeys(payload) {
		return await this.core.selectByKeys(payload);
	}
	//Select In-line-return promise;Keyで返す。
	async _selectByKeys(tableName, keys) {
		return await this.core._selectByKeys(tableName, keys);
	}
	async selectFirstOne(payload) {
		return await this.core.selectFirstOne(payload);
	}
	//Select FirstOnek
	async _selectFirstOne(tableName, range, direction) {
		return await this.core._selectFirstOne(tableName, range, direction);
	};

	//InsertUpdate
	async insertUpdate(payload) {
		return await this.core.insertUpdate(payload);
	}
	//private
	async _insertUpdate(tableName, keyPathName, data, callback) {
		return await this.core._insertUpdate(tableName, keyPathName, data, callback);
	}
	//public
	async deleteWithRange(payload) {
		return await this.core.deleteWithRange(payload);
	}
	//Delete
	async _deleteWithRange(tableName, range, condetions) {
		return await this.core._deleteWithRange(tableName, range, condetions);
	};
	//public
	async delete(payload) {
		return await this.core.delete(payload);
	}
	//Delete
	async _delete(tableName, keyPathValue) {
		return await this.core._delete(tableName, keyPathValue);
	};
	async truncate(payload) {
		return await this.core.truncate(payload);
	}
	//truncate
	async _truncate(tableName) {
		return await this.core._truncate(tableName);
	};
	//truncate
	async _createStore(tableName, keyPathName, isAutoIncrement) {
		return await this.core._createStore(tableName, keyPathName, isAutoIncrement);
	};
	async getObjectStoreNames() {
		return await this.core.getObjectStoreNames();
	}
}