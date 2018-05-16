export default class IndexeddbHelper {
  constructor(dbName) {
    this.IDBKeyRange = window.IDBKeyRange;
    this.indexedDB = window.indexedDB;
    this.dbName = dbName;
    this.keyPathMap = {};
  }

  makeKeyRange(start, end, isNotEqualStart, isNotEqualEnd) {
    return (isNotEqualStart === undefined && isNotEqualEnd === undefined)
      ? IDBKeyRange.bound(start, end, false, false)
      : IDBKeyRange.bound(start, end, isNotEqualStart, isNotEqualEnd);
  }
  makeKeyRangeUpper(start, isNotEqualStart) {
    return (isNotEqualStart !== true)
      ? IDBKeyRange.upperBound(start)
      : IDBKeyRange.upperBound(start, isNotEqualStart);
  }
  makeKeyRangeLower(end, isNotEqualEnd) {
    return (isNotEqualStart !== true)
      ? KeyRange.lowerBound(end)
      : IDBKeyRange.lowerBound(end, isNotEqualEnd);
  }
  makeKeyRangeOnly(only) {
    return (isNotEqualStart !== true)
      ? IDBKeyRange.only(only)
      : IDBKeyRange.lowerBound(end, isNotEqualEnd);
  }
  getKeyPath(tableName) {
    let self = this;
    return new Promise((resolve, reject) => {
      let keyPathName = self.keyPathMap[tableName];
      if (keyPathName !== undefined && keyPathName !== null) {
        resolve(keyPathName);
        return;
      }
      let request = self.indexedDB.open(self.dbName);
      request.onsuccess = (indexeddbevent) => {
        let db = request.result;
        let transaction = db.transaction([tableName], "readonly");
        transaction.oncomplete = (event) => {
          db.close();
          resolve();
        };
        transaction.onerror = (event) => {
          db.close();
          reject();
        };
        let objectStore = transaction.objectStore(tableName);
        //console.log("IndexeddbHelper.getKeyPath 2 "+objectStore.keyPath+"/"+tableName);
        db.close();
        let keyPathName = objectStore.keyPath;
        self.keyPathMap[tableName] = keyPathName;
        resolve(keyPathName);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  }
  //private
  getCurrentVersion() {
    let self = this;
    return new Promise((resolve, reject) => {
      let request = self.indexedDB.open(self.dbName);
      request.onsuccess = (event) => {
        let db = event.target.result;
        let version = db.version;
        db.close();
        // console.log("IndexeddbHelper.getCurrentVersion version:"+version);
        resolve(version);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  };
  //public
  selectAll(payload) {
    let {tableName, range, condetions} = payload;
    return this._selectAll(tableName, range, condetions);
  }
  //Select In-line-Keyで返す。
  _selectAll(tableName, range, direction) {
    let self = this;
    return new Promise((resolve, reject) => {
      //console.log("IndexeddbHelper.selectAll 1");
      self.getKeyPath(tableName).then((keypath) => {
        let request = self.indexedDB.open(self.dbName);
        request.onsuccess = (event) => {
          let db = event.target.result;
          let list = [];
          let objectStore = db.transaction(tableName).objectStore(tableName);
          let req = range === undefined
            ? objectStore.openCursor()
            : objectStore.openCursor(range);
          req.onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
              list.push(cursor.value);
              //console.log("selectAll:"+"/tableName:"+tableName+"/key:"+cursor.key+"/value:" +(cursor.value?JSON.stringify(cursor.value):""));
              cursor.continue();
            } else {
              db.close();
              resolve(list);
            }
          };
          req.onerror = (e) => {
            console.log("erroerror!!!!!!!!!!!!!!!!!" + e);
            db.close();
            reject(e);
          };
        }
        request.onabort = (e) => {
          console.log("erroeobjrror!!!!!!!!!!!!!!!!!" + e);
          reject(e);
        };
        request.onerror = (e) => {
          console.log("erroerror!!!!!!!!!!!!!!!!!" + e);
          console.log(e);
          reject(e);
        };
      }, (e) => {
        reject(e);
      })
    });
  };
  //public
  selectByKey(payload) {
    let {tableName, key} = payload;
    return this._selectByKey(tableName, key);
  }
  //Select In-line-return promise;Keyで返す。
  _selectByKey(tableName, key) {
    let self = this;
    //console.log("IndexeddbHelper._selectByKey 01　tableName:"+tableName+"/key:"+key+"/"+"");
    return new Promise((resolve, reject) => {
      let request = self.indexedDB.open(self.dbName);
      request.onsuccess = (event) => {
        let db = request.result;
        let transaction = db.transaction([tableName], "readonly");
        transaction.oncomplete = (event) => {
          db.close();
          resolve();
        };
        transaction.onerror = (e) => {
          db.close();
          reject(e);
        };
        let objectStore = transaction.objectStore(tableName);

        let objectStoreRequest = objectStore.get(key); //keyはsonomama
        objectStoreRequest.onsuccess = (event) => {
          let result = objectStoreRequest.result;
          //console.log("IndexeddbHelper.selectByKey 02 result:"+JSON.stringify(result)+" / "+key+"/"+tableName);
          db.close();
          resolve(result);
        };
        objectStoreRequest.onerror = (e) => {
          db.close();
          reject(e);
        };
      }
    });
  }
  //public
  selectFirstOne(payload) {
    let {tableName, range, direction} = payload;
    return this._selectFirstOne(tableName, range, direction);
  }
  //Select FirstOnek
  _selectFirstOne(tableName, range, direction) {
    let self = this;
    let firstOne = undefined;
    // console.log("IndexeddbHelper.selectAll 1");
    return new Promise((resolve, reject) => {
      let request = self.indexedDB.open(self.dbName);
      request.onsuccess = (event) => {
        let db = event.target.result;
        let objectStore = db.transaction(tableName).objectStore(tableName);
        let req = objectStore.openCursor(range);
        req.onsuccess = (event) => {
          let cursor = event.target.result;
          if (cursor) {
            if (firstOne === undfined) {
              firstOne = cursor.value;
              resolve(firstOne);
            }
            cursor.continue();
          } else {
            db.close();
            resolve();
          }
        };
        req.onerror = (e) => {
          console.log("erroerror!!!!!!!!!!!!!!!!!" + e);
          db.close();
          reject(e);
        };
      };
      request.onabort = (e) => {
        console.log("onabort!!!!!!!!!!!!!!!!!" + e);
        reject(e);
      };
      request.onerror = (e) => {
        console.log("erroerror!!!!!!!!!!!!!!!!!" + e);
        console.log(e);
        reject(e);
      };
    });
  };
  //InsertUpdate
  insertUpdate(payload) {
    let self = this;
    let {tableName, data} = payload;
    return new Promise((resolve, reject) => {
      this.getKeyPath(tableName).then((keyPathName) => {
        self._insertUpdate(tableName, keyPathName, data).then((result) => {
          resolve(result);
        }, (e) => {
          reject(e);
        });
      }, (e) => {
        reject(e);
      });
      return this._selectByKey(tableName, range, direction);
    });
  }
  //private
  _insertUpdate(tableName, keyPathName, data) {
    let self = this;
    return new Promise((resolve, reject) => {
      let keyPathValue = data[keyPathName];

        //console.log("_insertUpdate!!!!!01 tableName:"+tableName+"/!!!!!!!!!!!!" + keyPathValue+ JSON.stringify(data));
      self._selectByKey(tableName, keyPathValue).then((value) => {
          //    console.log("_insertUpdate!!!!!02 tableName:"+tableName+"/!!!!!!!!!!!!" + JSON.stringify(value));
        if (value === undefined) {
          let request = self.indexedDB.open(self.dbName);
          request.onsuccess = (event) => {
            let db = request.result;
            let transaction = db.transaction([tableName], "readwrite");
            transaction.oncomplete = (event) => {
              db.close();
              resolve();
            };
            transaction.onerror = (e) => {
              db.close();
              reject(e);
            };
            let objectStore = transaction.objectStore(tableName);
            // console.log("add key:"+key);
            let objectStoreRequest = objectStore.add(data); //,keyPath
            objectStoreRequest.onsuccess = (event) => {
              // console.log("onsuccess add key:"+key);
              db.close();
              resolve({data, keyPathValue});
            };
            objectStoreRequest.onerror = (e) => {
              self.update(tableName, keyPathName, data).then((value) => {
                resolve();
              });

              db.close();
            };
          }
        } else {
          //console.log("_insertUpdate!!!!!03 tableName:"+tableName+"/!!!!!!!!!!!!" + keyPathValue);
          self.update(tableName, keyPathName, data).then((value) => {
            resolve(value);
          },(e) => {console.log("_insertUpdate!!!!!03 e:")+e;alert(e)});
        }
      });
    })
  }
  //private
  update(tableName, keyPathValue, data) {
    let self = this;
    return new Promise((resolve, reject) => {
      let request = self.indexedDB.open(self.dbName);
      request.onsuccess = (event) => {
        let db = request.result;
        let transaction = db.transaction([tableName], "readwrite");
        transaction.oncomplete = (event) => {
          db.close();
          resolve();
        };
        transaction.onerror = (e) => {
          db.close();
          resolve(e);
        };
        let objectStore = transaction.objectStore(tableName);
        let objectStoreRequest = objectStore.put(data); //,keyPathValue
        objectStoreRequest.onsuccess = (event) => {
          db.close();
          resolve({data, keyPathValue});
        };
        objectStoreRequest.onerror = (e) => {
          db.close();
          resolve(e);
        };
      }
    })
  };
  //private
  isMutch(value, condetions) {
    if (condetions === undefined || condetions === null) {
      return false;
    }
    if (Array.isArray(condetions)) {
      for (let condition of condetions) {
        if (this.isMutch(value, condition)) {
          return true;
        }
      }
      return false;
    } else {
      for (let key in condetions) {
        let condition = condetions[key];
        if (typeof condition === 'object') {
          if (this.isMutch(value, condition)) {
            return true;
          }
        } else {
          let target = value[key];
          if (target !== condition) {
            return false;
          }
        }
      }
      return true;
    }
  };
  //public
  deleteWithRange(payload) {
    let {tableName, range, condetions} = payload;
    return this._deleteWithRange(tableName, range, condetions);
  }
  //Delete
  _deleteWithRange(tableName, range, condetions) {
    let self = this;
    //console.log("IndexeddbHelper.selectAll 1");
    return new Promise((resolve, reject) => {
      self.getKeyPath(tableName).then((keypath) => {

        let request = self.indexedDB.open(self.dbName);
        request.onsuccess = (event) => {
          let db = event.target.result;
          let objectStore = db.transaction(tableName).objectStore(tableName);
          let req = objectStore.openCursor(range);
          req.onsuccess = (event) => {
            let cursor = event.target.result;
            let list = [];
            if (cursor) {
              let value = cursor.value;
              if (self.isMutch(value, condetions)) {
                let objectStoreRequest = objectStore.delete(cursor.key);
                objectStoreRequest.onsuccess = (event) => {
                  list.push(data);
                }
                objectStoreRequest.onerror = (e) => {
                  db.close();
                  resolve(list);
                };
              }
              cursor.continue();
            } else {
              db.close();
              resolve(list);
            }
          };
          req.onerror = (e) => {
            console.log("erroerror!!!!!!!!!!!!!!!!!" + e);
            db.close();
            resolve(e);
          };
        };
        request.onabort = (e) => {
          console.log("erroeobjrror!!!!!!!!!!!!!!!!!" + e);
          resolve(e);
        };
        request.onerror = (e) => {
          console.log("erroerror!!!!!!!!!!!!!!!!!" + e);
          console.log(e);
          resolve(e);
        };
      });
    });
  };
  //public
  delete(payload) {
    let {tableName, key} = payload;
    return this._delete(tableName, key);
  }
  //Delete
  _delete(tableName, keyPathValue) {
    let self = this;
    return new Promise((resolve, reject) => {
      let request = self.indexedDB.open(self.dbName);
      request.onsuccess = (event) => {
        let db = request.result;
        let transaction = db.transaction([tableName], "readwrite");
        transaction.oncomplete = (event) => {
          db.close();
          resolve();
        };
        transaction.onerror = (e) => {
          db.close();
          reject(e);
        };
        let objectStore = transaction.objectStore(tableName);
        // console.log("delete keyPath:"+keyPath);
        let objectStoreRequest = objectStore.delete(keyPathValue + "");
        objectStoreRequest.onsuccess = (event) => {
          db.close();
          resolve({tableName,keyPathValue});
          // console.log("onsuccess delete keyPath:"+keyPath);
        }
        objectStoreRequest.onerror = (e) => {
          db.close();
          reject(e);
          // console.log("onerror delete keyPath:"+keyPath);
        };
      }
    });
  };
  //public
  truncate(payload) {
    let {tableName} = payload;
    return this._truncate(tableName);
  }
  //truncate
  _truncate(tableName) {
    let self = this;
    return new Promise((resolve, reject) => {
      let request = self.indexedDB.open(self.dbName);
      request.onsuccess = (event) => {
        let db = request.result;
        let transaction = db.transaction([tableName], "readwrite");
        transaction.oncomplete = (event) => {
          db.close();
          resolve();
        };
        transaction.onerror = (e) => {
          db.close();
          resolve(e);
        };
        let objectStore = transaction.objectStore(tableName);
        let objectStoreRequest = objectStore.clear();
        objectStoreRequest.onsuccess = (event) => {
          db.close();
          resolve();
        };
      };
    });
  };
  getObjectStoreNames() {
    let self = this;
    return new Promise((resolve, reject) => {
      let request = self.indexedDB.open(self.dbName);
      request.onsuccess = (event) => {
        let db = event.target.result;
        let names = db.objectStoreNames;
        db.close();
        resolve(names);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  }
  isExistsObjectStore(tableName) {
    let self = this;
    return new Promise((resolve, reject) => {
      let request = self.indexedDB.open(self.dbName);
      request.onsuccess = (event) => {
        let db = event.target.result;
        let isExist = false;
        for (let name of db.objectStoreNames) {
          //console.log("isExistsObjectStore tableName:" + tableName + "/name:" + name);
          if (name === tableName) {
            isExist = true;
            break;
          }
        }
        db.close();
        // console.log("IndexeddbHelper.getCurrentVersion version:"+version);
        resolve(isExist);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });

  }
  //public
  createStore(payload) {
    let {tableName, keyPathName, isAutoIncrement} = payload;
    return this._createStore(tableName, keyPathName, isAutoIncrement);
  }
  //createStore
  _createStore(tableName, keyPathName, isAutoIncrement) {
    let self = this;
    return new Promise((resolve, reject) => {
      // console.info("Object Store try create !"+tableName);
      self.isExistsObjectStore(tableName).then((isExist) => {
        if (isExist === false) {
          self.getCurrentVersion().then((version) => {
            let newVersion = (version * 1) + 1; //計算結果を変数に代入すると行ける。
            let request = null;
            try {
              //console.log("self.dbName" + self.dbName + "/newVersion:" + newVersion);
              //objectStore:"mLYZt0r50EZ3xWDEAJpODEFosbp-4c6Hq72I_zajqv4"
              // tableName:mLYZt0r50EZ3xWDEAJpODEFosbp-4c6Hq72I_zajqv4
              request = self.indexedDB.open(self.dbName, newVersion);
            } catch (e) {
              console.log(e);
              reject(e);
            }
            //let request = self.indexedDB.open(self.dbName, newVersion);
            request.onerror = (event) => { //すでに有る場合
              let db = event.target.result;
              console.log("Why didn't you allow my web app to use IndexedDB?! A01_createStore");
              resolve();
            };
            request.onsuccess = (event) => {
              let db = event.target.result;
              db.close();
              // console.log("IndexeddbHelper createStore opened tableName:"+tableName+"/event.oldVersion:"+event.oldVersion);
              resolve();
            };
            request.onupgradeneeded = (event) => {
              let db = event.target.result;
              // Create an objectStore for this database
              try {
                let isExist = false;
                for (let name of db.objectStoreNames) {
                  //console.log("tableName:" + tableName + "/name:" + name);
                  if (name === tableName) {
                    isExist = true;
                    break;
                  }
                }
                if (isExist === false) {
                  let objectStore = db.createObjectStore(tableName, {keyPath: keyPathName});
                }
              } catch (e) {
                console.log(e);
              }

              //objectStore.createIndex(keyPath+"Index", keyPath, { unique: true });
              // console.log("IndexeddbHelper createStore Yes! Succcess! tableName:"+tableName+"/keyPath:"+keyPath);
              db.close();
              resolve();
            };
          }, (e) => {
            reject(e)
          });
        } else {
          resolve();
        }
      })

    });
  };
  //public
  dropStore(payload) {
    let {tableName} = payload;
    return this._dropStore(tableName);
  }
  //DropStore
  _dropStore(tableName) {
    let self = this;
    return new Promise((resolve, reject) => {
      // console.info("Object Store try delete !"+tableName);
      self.getCurrentVersion().then((version) => {
        let newVersion = (version * 1) + 1; //計算結果を変数に代入すると行ける。
        let request = self.indexedDB.open(self.dbName, newVersion);
        request.onsuccess = (event) => {
          let db = event.target.result;
          db.close();
          // console.info("Object Store delete is OKOK?"+tableName+"/version:"+version);
          resolve();
        };
        request.onupgradeneeded = (event) => {
          let db = event.target.result;
          db.deleteObjectStore(tableName);
          // console.info("Object Store delete is success!"+tableName);
          db.close();
          resolve();
        };
        request.onerror = (e) => {
          // console.info("Object Store delete is fail:"+version+"/"+JSON.stringify(e));
          reject(e);
        };
      }, (e) => {
        reject(e)
      });
    });
  };
  //IDを生成
  buildKeyPath(key1, key2, key3, key4, key5) {
    let array = [];
    if (key1 !== undefined) {
      array.push((key1 + "").split("&").join("&amp;").split(".").join("&#046;"));
    }
    if (key2 !== undefined) {
      array.push((key2 + "").split("&").join("&amp;").split(".").join("&#046;"));
    }
    if (key3 !== undefined) {
      array.push((key3 + "").split("&").join("&amp;").split(".").join("&#046;"));
    }
    if (key4 !== undefined) {
      array.push((key4 + "").split("&").join("&amp;").split(".").join("&#046;"));
    }
    if (key5 !== undefined) {
      array.push((key5 + "").split("&").join("&amp;").split(".").join("&#046;"));
    }
    return array.join("");
  };
}
