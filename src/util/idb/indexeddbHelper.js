import IdbUtil from './idbUtil'
const MODE_R = "readonly";
const MODE_RW = "readwrite";
export default class IndexeddbHelper {
  constructor(dbName) {
    this.IDBKeyRange = window.IDBKeyRange;
    this.indexedDB = window.indexedDB;
    this.dbName = dbName;
    this.keyPathMap = {};
  }

  getOpenDB(newVersion) {
    return new Promise((resolve, reject) => {
      let request = this.indexedDB.open(this.dbName, newVersion);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onupgradeneeded = (event) => {
        resolve(event.target.result);
      };
      request.onabort = (e) => {
        resolve(e);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  }

  getObjectStore(db, tableName, tables, mode) {
    let transaction = db.transaction(tables, mode);
    transaction.oncomplete = (event) => {
      db.close();
    };
    transaction.onerror = (event) => {
      db.close();
    };
    return transaction.objectStore(tableName);
  }
  throwNewError(callerName) {
    return(e) => {
      if (e.stack) {
        console.log(e.stack);
      } else {
        console.log(e.message, e);
      }
      console.error(
        callerName
        ? callerName
        : "" + "/" + e);
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
    const db = await this.getOpenDB().catch(this.throwNewError("getKeyPath->getOpenDB"));
    let objectStore = this.getObjectStore(db, tableName, [tableName], MODE_R);
    db.close();
    let keyPathNameCurrent = objectStore.keyPath;
    this.keyPathMap[tableName] = keyPathNameCurrent;
    return keyPathNameCurrent;
  }
  //private
  async getCurrentVersion() {
    let db = await this.getOpenDB().catch(this.throwNewError("getCurrentVersion->getOpenDB"));
    const version = db.version;
    db.close();
    return version;
  };
  //public
  async selectAll(payload) {
    let {tableName, range, condetions} = payload;
    return await this._selectAll(tableName, range, condetions);
  }
  //Select In-line-Keyで返す。
  async _selectAll(tableName, range, direction) {
    const db = await this.getOpenDB().catch(this.throwNewError("_selectAll->getOpenDB tableName:" + tableName));
    let objectStore = this.getObjectStore(db, tableName, [tableName], MODE_R);
    return await this._selectAllExecute(objectStore, range);
  };
  _selectAllExecute(objectStore, range, isGetFirstOne) {
    return new Promise((resolve, reject) => {
      const list = [];
      let req = range === undefined
        ? objectStore.openCursor()
        : objectStore.openCursor(range);
      req.onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
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
    let {tableName, key} = payload;
    return await this._selectByKey(tableName, key);
  }
  //Select In-line-return promise;Keyで返す。
  async _selectByKey(tableName, key) {
    const db = await this.getOpenDB().catch(this.throwNewError("_selectByKey->getOpenDB tableName:" + tableName));
    console.log("_selectByKey tableName:" + tableName + "/pk:" + key);
    console.log(key);
    return await this._selectByKeyOnTran(db, tableName, key).catch(this.throwNewError("_selectByKey->_selectByKeyOnTran tableName:" + tableName));
  }
  _selectByKeyOnTran(db, tableName, key, tables) {
    return new Promise((resolve, reject) => {
      let objectStore = this.getObjectStore(db, tableName, [tableName], MODE_R);
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
    let {tableName, range, direction} = payload;
    return await this._selectFirstOne(tableName, range, direction);
  }
  //Select FirstOnek
  async _selectFirstOne(tableName, range, direction) {
    const db = await this.getOpenDB().catch(this.throwNewError("_selectFirstOne->getOpenDB tableName:" + tableName));
    let objectStore = this.getObjectStore(db, tableName, [tableName], MODE_R);
    return await this._selectAllExecute(objectStore, range, true);
  };

  //InsertUpdate
  async insertUpdate(payload) {
    let {tableName, data, callback} = payload;
    const keyPathName = this.getKeyPathByMap();
    return await this._insertUpdate(tableName, keyPathName, data, callback).catch(this.throwNewError("insertUpdate->_insertUpdate tableName:" + tableName));
  }
  //private
  async _insertUpdate(tableName, keyPathName, data, callback) {
    const key = data[keyPathName];
    const db = await this.getOpenDB().catch(this.throwNewError("_insertUpdate->getOpenDB tableName:" + tableName));
    const tables = IdbUtil.currentTables(tableName);
    const value = await this._selectByKeyOnTran(db, tableName, key, tables).catch(this.throwNewError("_insertUpdate->_selectByKeyOnTran tableName:" + tableName));
    if (callback) {
      callback(value, data);
    }
    if (value === undefined) {
      return await this._insertExecute(db, tableName, key, data, tables).catch(this.throwNewError("_insertUpdate->_insertExecute tableName:" + tableName));
    } else {
      return await this._updateExecute(db, tableName, key, data, tables).catch(this.throwNewError("_insertUpdate->_updateExecute tableName:" + tableName));

    }
  }
  _insertExecute(db, tableName, key, data, tables) {
    let objectStore = this.getObjectStore(db, tableName, tables, MODE_RW);
    return new Promise((resolve, reject) => {
      let objectStoreRequest = objectStore.add(data); //,keyPath
      objectStoreRequest.onsuccess = (event) => {
        resolve({data, key});
      };
      objectStoreRequest.onerror = (e) => {
        reject(e);
      };
    });
  }
  _updateExecute(db, tableName, key, data, tables) {
    return new Promise((resolve, reject) => {
      let objectStore = this.getObjectStore(db, tableName, tables, MODE_RW);
      let request = objectStore.put(data); //,keyPathValue
      request.onsuccess = (event) => {
        resolve({data, key});
      };
      request.onerror = (e) => {
        resolve(e);
      };
    });
  };
  //public
  async deleteWithRange(payload) {
    let {tableName, range, condetions} = payload;
    return await this._deleteWithRange(tableName, range, condetions);
  }
  //Delete
  async _deleteWithRange(tableName, range, condetions) {
    const db = await this.getOpenDB().catch(this.throwNewError("_deleteWithRange->getOpenDB tableName:" + tableName));
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
    let {tableName, key} = payload;
    return await this._delete(tableName, key);
  }
  //Delete
  async _delete(tableName, keyPathValue) {
    const db = await this.getOpenDB().catch(this.throwNewError("_delete->getOpenDB tableName:" + tableName));
    const tables = IdbUtil.currentTables(tableName);
    return await this._deleteOnTran(db, tableName, keyPathValue, tables);
  };
  _deleteOnTran(db, tableName, key, tables) {
    return new Promise((resolve, reject) => {
      let objectStore = this.getObjectStore(db, tableName, tables, MODE_RW);
      let request = objectStore.delete(key + "");
      request.onsuccess = (event) => {
        resolve({tableName, key});
      }
      request.onerror = (e) => {
        reject(e);
      };
    });
  }
  //public
  async truncate(payload) {
    let {tableName} = payload;
    return await this._truncate(tableName);
  }
  //truncate
  async _truncate(tableName) {
    const db = await this.getOpenDB().catch(this.throwNewError("_truncate->getOpenDB tableName:" + tableName));
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
    const db = await this.getOpenDB().catch(this.throwNewError("getObjectStoreNames->getOpenDB"));
    const names = db.objectStoreNames;
    db.close();
    return names;
  }
  async isExistsObjectStore(tableName) {
    const db = await this.getOpenDB().catch(this.throwNewError("isExistsObjectStore->getOpenDB tableName:" + tableName));
    let isExist = false;
    for (let name of db.objectStoreNames) {
      if (name === tableName) {
        isExist = true;
        break;
      }
    }
    db.close();
    return isExist;
  }
  //public
  async createStore(payload) {
    let {tableName, keyPathName, isAutoIncrement} = payload;
    return await this._createStore(tableName, keyPathName, isAutoIncrement);
  }
  //createStore
  async _createStore(tableName, keyPathName, isAutoIncrement) {
    const isExistsObjectStore = await this.isExistsObjectStore();
    if (isExistsObjectStore === false) {
      const newVersion = (await this.getCurrentVersion()) + 1;
      const db = await this.getOpenDB(newVersion).catch(this.throwNewError("_createStore->getOpenDB tableName:" + tableName));
      let isExist = false;
      for (let name of db.objectStoreNames) {
        if (name === tableName) {
          isExist = true;
          break;
        }
      }
      if (isExist === false) {
        let objectStore = db.createObjectStore(tableName, {keyPath: keyPathName});
      }
      db.close();
    };
  };
  //public
  async dropStore(payload) {
    let {tableName} = payload;
    return await this._dropStore(tableName);
  }
  //DropStore
  async _dropStore(tableName) {
    const newVersion = (await this.getCurrentVersion()) + 1;
    const db = await this.getOpenDB(newVersion).catch(this.throwNewError("_dropStore->getOpenDB tableName:" + tableName));
    db.deleteObjectStore(tableName);
    db.close();
    return;
  };
}
