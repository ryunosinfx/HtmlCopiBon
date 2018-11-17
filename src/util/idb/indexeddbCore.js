import { IdbUtil } from './idbUtil'
const MODE_R = "readonly";
const MODE_RW = "readwrite";
export class IndexeddbCore {
	constructor(dbName) {
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

	getOpenDB(newVersion) {
		return new Promise((resolve, reject) => {
			this.lastVersion = newVersion;
			if ((this.lastVersion) && this.db) {
				this.db.close();
				this.isUpdateOpen = true;
				// this.cacheClear();
			} else if (this.db && this.isDBClosed === false) {
				resolve(this.db);
				return;
			} else if (this.lastVersion) {
				this.isUpdateOpen = true;
			} else {
				this.isUpdateOpen = false;
			}
			// TODO instance
			let request = this.indexedDB.open(this.dbName, newVersion);
			request.onsuccess = (event) => {
				this.db = event.target.result;
				this.isDBClosed = false;
				resolve(this.db);
			};
			request.onupgradeneeded = (event) => {
				this.db = event.target.result;
				this.isDBClosed = false;
				resolve(this.db);
			};
			request.onabort = (e) => {
				resolve(e);
			};
			request.onerror = (e) => {
				reject(e);
			};
		});
	}
	closeDB() {
		if (this.isUpdateOpen) {
			this.db.close();
			this.isDBClosed = true;
		} else {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(() => {
				this.db.close();
				this.isDBClosed = true;
			}, 1000);
		}
	}
	cacheClear() {
		const keys = [];
		for (let tableName in this.tableCache) {
			keys.push(tableName);
		}
		for (let tableName of keys) {
			const tableCache = this.tableCache[tableName];
			for (let index in tableCache) {
				delete tableCache[index];
			}
		}
	}
	setCache(tableName, key, value) {
		if (!value || !value.data) {
			return;
		}
		const data = value.data;
		for (let key in data) {
			const elm = data[key];
			if (elm && elm.byteLength) {
				return;
			}
		}
		if (!this.tableCache[tableName]) {
			this.tableCache[tableName] = {};
		}
		this.tableCache[tableName][key] = value;
	}
	getCache(tableName, key) {
		const tableCache = this.tableCache[tableName];
		return tableCache ? tableCache[key] : null;
	}
	getObjectStore(db, tableName, tables, mode) {
		if (mode === MODE_R) {
			this.cacheClear();
		}
		let transaction = db.transaction(tables, mode);
		transaction.oncomplete = (event) => {
			this.closeDB();
		};
		transaction.onerror = (event) => {
			this.closeDB();
		};
		const table = transaction.objectStore(tableName);
		return table;
	}
	throwNewError(callerName) {
		return (e) => {
			console.error(e);
			if (e.stack) {
				console.log(e.stack);
			} else {
				console.log(e.message, e);
			}
			console.error(
				callerName ?
				callerName :
				"" + "/" + e);
			throw new Error(e);
		}
	}
	getKeyPathByMap(tableName) {
		return this.keyPathMap[tableName];
	}
	async getKeyPath(tableName) {
		let keyPathName = this.keyPathMap[tableName];
		if (keyPathName !== undefined && keyPathName !== null) {
			return keyPathName;
		}
		const db = await this.getOpenDB()
			.catch(this.throwNewError("getKeyPath->getOpenDB"));
		let objectStore = this.getObjectStore(db, tableName, [tableName], MODE_R);
		this.closeDB();
		let keyPathNameCurrent = objectStore.keyPath;
		this.keyPathMap[tableName] = keyPathNameCurrent;
		return keyPathNameCurrent;
	}
	//private
	async getCurrentVersion() {
		let db = await this.getOpenDB()
			.catch(this.throwNewError("getCurrentVersion->getOpenDB"));
		const version = db.version;
		this.closeDB();
		return version;
	};
	//public
	async selectAll(payload) {
		let { tableName, range, condetions } = payload;
		return await this._selectAll(tableName, range, condetions);
	}
	//Select In-line-Keyで返す。
	async _selectAll(tableName, range, direction) {
		const db = await this.getOpenDB()
			.catch(this.throwNewError("_selectAll->getOpenDB tableName:" + tableName));
		let objectStore = this.getObjectStore(db, tableName, [tableName], MODE_R);
		return await this._selectAllExecute(objectStore, range);
	};
	_selectAllExecute(objectStore, range, isGetFirstOne) {
		return new Promise((resolve, reject) => {
			const list = [];
			let req = range === undefined ?
				objectStore.openCursor() :
				objectStore.openCursor(range);
			req.onsuccess = (event) => {
				let cursor = event.target.result;
				if (cursor) {
					console.log(cursor.value)
					list.push(cursor.value);
					if (isGetFirstOne) {
						resolve(list[0]);
						return;
					}
					cursor.continue();
				} else {
					resolve(list);
				}
			};
			req.onerror = (e) => {
				reject(e);
			};
		});

	}
	//public
	async selectByKey(payload) {
		let { tableName, key } = payload;
		return await this._selectByKey(tableName, key);
	}
	//Select In-line-return promise;Keyで返す。
	async _selectByKey(tableName, key) {
		const db = await this.getOpenDB()
			.catch(this.throwNewError("_selectByKey->getOpenDB tableName:" + tableName));
		// console.log("_selectByKey tableName:" + tableName + "/pk:" + key);
		// console.log(key);
		return await this._selectByKeyOnTran(db, tableName, key)
			.catch(this.throwNewError("_selectByKey->_selectByKeyOnTran tableName:" + tableName + "/mode:" + MODE_R));
	}
	_selectByKeyOnTran(db, tableName, key, tables, mode = MODE_R) {
		return new Promise((resolve, reject) => {
			const cachekey = tableName + "_" + mode;
			const cache = this.getCache(cachekey, key);
			if (cache) {
				resolve(cache);
			} else {
				let objectStore = this.getObjectStore(db, tableName, [tableName], mode);
				let request = objectStore.get(key); //keyはsonomama
				request.onsuccess = (event) => {
					const result = request.result;
					resolve(result);
					this.setCache(cachekey, key, result);
				};
				request.onerror = (e) => {
					reject(e);
				};
			}
		});
	}
	//public
	async selectByKeys(payload) {
		let { tableName, keys } = payload;
		return await this._selectByKeys(tableName, keys);
	}
	//Select In-line-return promise;Keyで返す。
	async _selectByKeys(tableName, keys) {
		const db = await this.getOpenDB()
			.catch(this.throwNewError("_selectByKeys->getOpenDB tableName:" + tableName));
		return await this._selectByKeysOnTran(db, tableName, keys)
			.catch(this.throwNewError("_selectByKeys->_selectByKeyOnTran tableName:" + tableName));
	}
	async _selectByKeysOnTran(db, tableName, keys, tables) {
		let objectStore = this.getObjectStore(db, tableName, [tableName], MODE_R);
		const retMap = {};
		for (let key of keys) {
			const cache = this.getCache(tableName, key);
			const result = cache ? cache : await this._getByKeyFromeObjectStore(objectStore, key);
			if (!cache) {
				this.setCache(tableName, key, result);
			}
			retMap[key] = result;
		}
		return retMap;
	}
	_getByKeyFromeObjectStore(objectStore, key) {
		return new Promise((resolve, reject) => {
			if (!key) {
				resolve(null);
			}
			let request = objectStore.get(key); //keyはsonomama
			request.onsuccess = (event) => {
				resolve(request.result);
			};
			request.onerror = (e) => {
				reject(e);
			};
		});
	}
	//public
	async selectFirstOne(payload) {
		let { tableName, range, direction } = payload;
		return await this._selectFirstOne(tableName, range, direction);
	}
	//Select FirstOnek
	async _selectFirstOne(tableName, range, direction) {
		const db = await this.getOpenDB()
			.catch(this.throwNewError("_selectFirstOne->getOpenDB tableName:" + tableName));
		let objectStore = this.getObjectStore(db, tableName, [tableName], MODE_R);
		return await this._selectAllExecute(objectStore, range, true);
	};

	//InsertUpdate
	async insertUpdate(payload) {
		let { tableName, data, callback } = payload;
		const keyPathName = this.getKeyPathByMap();
		return await this._insertUpdate(tableName, keyPathName, data, callback)
			.catch(this.throwNewError("insertUpdate->_insertUpdate tableName:" + tableName));
	}
	//private
	async _insertUpdate(tableName, keyPathName, data, callback) {
		const key = data[keyPathName];
		const db = await this.getOpenDB()
			.catch(this.throwNewError("_insertUpdate->getOpenDB tableName:" + tableName));
		const tables = IdbUtil.currentTables(tableName);
		const value = await this._selectByKeyOnTran(db, tableName, key, tables, MODE_RW)
			.catch(this.throwNewError("_insertUpdate->_selectByKeyOnTran tableName:" + tableName + "/MODE_RW"));
		if (callback) {
			callback(value, data);
		}
		if (value === undefined) {
			return await this._insertExecute(db, tableName, key, data, tables)
				.catch(this.throwNewError("_insertUpdate->_insertExecute tableName:" + tableName));
		} else {
			return await this._updateExecute(db, tableName, key, data, tables)
				.catch(this.throwNewError("_insertUpdate->_updateExecute tableName:" + tableName));
		}
	}
	_insertExecute(db, tableName, key, data, tables) {
		let objectStore = this.getObjectStore(db, tableName, tables, MODE_RW);
		return new Promise((resolve, reject) => {
			let objectStoreRequest = objectStore.add(data); //,keyPath
			objectStoreRequest.onsuccess = (event) => {
				resolve({ data, key });
			};
			objectStoreRequest.onerror = (e) => {
				console.error(e);
				reject(e);
			};
		});
	}
	_updateExecute(db, tableName, key, data, tables) {
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(db, tableName, tables, MODE_RW);
			let request = objectStore.put(data); //,keyPathValue
			request.onsuccess = (event) => {
				resolve({ data, key });
			};
			request.onerror = (e) => {
				console.error(e);
				resolve(e);
			};
		});
	};
	//public
	async deleteWithRange(payload) {
		let { tableName, range, condetions } = payload;
		return await this._deleteWithRange(tableName, range, condetions);
	}
	//Delete
	async _deleteWithRange(tableName, range, condetions) {
		const db = await this.getOpenDB()
			.catch(this.throwNewError("_deleteWithRange->getOpenDB tableName:" + tableName));
		const tables = IdbUtil.currentTables(tableName);
		return await this._deleteWithRangeExecute(db, tableName, range, condetions, tables);
	};
	_deleteWithRangeExecute(db, tableName, range, condetions, tables) {
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(db, tableName, tables, MODE_RW);
			let request = objectStore.openCursor(range);
			request.onsuccess = (event) => {
				let cursor = event.target.result;
				let list = [];
				if (cursor) {
					let value = cursor.value;
					if (IdbUtil.isMutch(value, condetions)) {
						let or = objectStore.delete(cursor.key);
						or.onsuccess = (event) => {
							list.push(value);
						}
						or.onerror = (e) => {
							//momiee
						};
					}
					cursor.continue();
				} else {
					resolve(list);
				}
			};
			request.onerror = (e) => {
				reject(e);
			};
		});
	}
	//public
	async delete(payload) {
		let { tableName, key } = payload;
		return await this._delete(tableName, key);
	}
	//Delete
	async _delete(tableName, keyPathValue) {
		const db = await this.getOpenDB()
			.catch(this.throwNewError("_delete->getOpenDB tableName:" + tableName));
		const tables = IdbUtil.currentTables(tableName);
		return await this._deleteOnTran(db, tableName, keyPathValue, tables);
	};
	_deleteOnTran(db, tableName, key, tables) {
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(db, tableName, tables, MODE_RW);
			let request = objectStore.delete(key + "");
			request.onsuccess = (event) => {
				resolve({ tableName, key });
			}
			request.onerror = (e) => {
				console.error(e);
				reject(e);
			};
		});
	}
	//public
	async truncate(payload) {
		let { tableName } = payload;
		return await this._truncate(tableName);
	}
	//truncate
	async _truncate(tableName) {
		const db = await this.getOpenDB()
			.catch(this.throwNewError("_truncate->getOpenDB tableName:" + tableName));
		const tables = IdbUtil.currentTables(tableName);
		return await this._truncateExecute(db, tableName, tables);
	};
	//truncate
	_truncateExecute(db, tableName, tables) {
		return new Promise((resolve, reject) => {
			let objectStore = this.getObjectStore(db, tableName, tables, MODE_RW);
			let request = objectStore.clear();
			request.onsuccess = (event) => {
				resolve();
			};
			request.onerror = (e) => {
				reject(e);
			};
		});
	};
	async getObjectStoreNames() {
		const db = await this.getOpenDB()
			.catch(this.throwNewError("getObjectStoreNames->getOpenDB"));
		const names = db.objectStoreNames;
		this.closeDB();
		return names;
	}
	async isExistsObjectStore(tableName) {
		const db = await this.getOpenDB()
			.catch(this.throwNewError("isExistsObjectStore->getOpenDB tableName:" + tableName));
		let isExist = false;
		for (let name of db.objectStoreNames) {
			if (name === tableName) {
				isExist = true;
				break;
			}
		}
		this.closeDB();
		return isExist;
	}
	//public
	async createStore(payload) {
		let { tableName, keyPathName, isAutoIncrement } = payload;
		return await this._createStore(tableName, keyPathName, isAutoIncrement);
	}
	//createStore
	async _createStore(tableName, keyPathName, isAutoIncrement) {
		const isExistsObjectStore = await this.isExistsObjectStore();
		if (isExistsObjectStore === false) {
			const newVersion = (await this.getCurrentVersion()) + 1;
			const db = await this.getOpenDB(newVersion)
				.catch(this.throwNewError("_createStore->getOpenDB tableName:" + tableName));
			let isExist = false;
			for (let name of db.objectStoreNames) {
				if (name === tableName) {
					isExist = true;
					break;
				}
			}
			if (isExist === false) {
				db.createObjectStore(tableName, { keyPath: keyPathName });
			}
			this.closeDB();
		};
	};
	//public
	async dropStore(payload) {
		let { tableName } = payload;
		return await this._dropStore(tableName);
	}
	//DropStore
	async _dropStore(tableName) {
		const newVersion = (await this.getCurrentVersion()) + 1;
		const db = await this.getOpenDB(newVersion)
			.catch(this.throwNewError("_dropStore->getOpenDB tableName:" + tableName));
		db.deleteObjectStore(tableName);
		this.closeDB();
		return;
	};
}