/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ViewUtil {
  constructor() {}
  static create(id, clasｓName, text) {
    return ViewUtil.ce("div", id, clasｓName, text);
  }
  static createInput(id, clasｓName, text) {
    return ViewUtil.ce("input", id, clasｓName, text);
  }
  static createText(id, clasｓName, text) {
    return ViewUtil.ce("text", id, clasｓName, text);
  }
  static createFile(id, clasｓName, text) {
    return ViewUtil.ce("input", id, clasｓName, text, "file");
  }
  static createCanvas(id, clasｓName, text) {
    return ViewUtil.ce("canvas", id, clasｓName, text);
  }
  static createImage(id, clasｓName, text) {
    return ViewUtil.ce("img", id, clasｓName, text);
  }
  static createUl(id, clasｓName, text) {
    return ViewUtil.ce("ul", id, clasｓName, text);
  }
  static createLabel(id, clasｓName, text, forId) {
    const elm = ViewUtil.ce("label", id, clasｓName, text);
    elm.setAttribute("for", forId);
    return elm;
  }
  static createLi(id, clasｓName, text) {
    return ViewUtil.ce("li", id, clasｓName, text);
  }
  static createSpan(id, clasｓName, text) {
    return ViewUtil.ce("span", id, clasｓName, text);
  }
  static createStrong(id, clasｓName, text) {
    return ViewUtil.ce("strong", id, clasｓName, text);
  }
  static createA(id, clasｓName, text) {
    return ViewUtil.ce("a", id, clasｓName, text);
  }
  static ce(tagName, id, clasｓName, text, type) {
    const elm = document.createElement(tagName);
    elm.className = clasｓName;
    if (id) {
      elm.id = id;
    }
    if (tagName === "input" && text) {
      elm.setAttribute("value", text);
      if (type) {
        elm.setAttribute("type", type);
      }
    } else if (text) {
      elm.textContent = text;
    }
    return elm;
  }
  static on(elm, eventType, eventHandler) {
    elm.addEventListener(eventType, eventHandler, false);
  }
  static off(elm, eventType, eventHandler) {
    elm.removeEventListener(eventType, eventHandler, false);
  }

  static append(parent, child) {
    parent.appendChild(child);
  }

  static insertFirst(parent, child) {
    if (parent.hasChildNodes()) {
      parent.insertBefore(child, parent.childNodes[0]);
    } else {
      parent.appendChild(child);
    }
  }
  static getBodyElm() {
    return document.getElementsByTagName("body")[0];
  }
  static attachBody(elm) {
    document.getElementsByTagName("body")[0].appendChild(elm);
  }
  static detacthBodyById(id) {
    const child = documet.getElementById(id);
    document.getElementsByTagName("body")[0].removeChild(child);
  }
  static removeChild(child) {
    child.parentNode.removeChild(child);
  }
  static remove(id) {
    const child = documet.getElementById(id);
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }
  }
  static removeChildren(id) {
    const elm = documet.getElementById(id);
    while (elm.firstChild) {
      elm.removeChild(elm.firstChild);
    }
  }
  static setStyles(elm, styleObj) {
    for(let name in styleObj){
      elm.style[name] = styleObj[name];
    }
  }
  static text(elm, text) {
    elm.textContent = text;
  }
  static emit(elm, eventType, isBubbling = true, isCancelable = true) {
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent(eventType, isBubbling, isCancelable);
    return elm.dispatchEvent(evt);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ViewUtil;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_mainService__ = __webpack_require__(2);


class BaseView {
  constructor(anker) {
    this.elm = this.render();
    this.ms = __WEBPACK_IMPORTED_MODULE_1__service_mainService__["a" /* default */].getInstance();
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(anker, this.elm);
  }
  render() {
    const elm = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("BaseView", "BaseView");
    return elm;
  }
  getAnker(){
    return this.elm;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseView;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mainServiceImpl__ = __webpack_require__(10);

const mainServiceImpl = new __WEBPACK_IMPORTED_MODULE_0__mainServiceImpl__["a" /* default */]();
const currentSiries = "";
const currentTitle = "";
class MainService {
  static getInstance(){
    return mainServiceImpl;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MainService;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseView__ = __webpack_require__(1);


class ProgressBar  {
  constructor() {
    this.elm = this.render();
  }
  render() {
    const elm = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("ProgressBar", "ProgressBar");
    return elm;
  }
  init() {
    this.elm.style.width = '0%';
    this.elm.textContent = '0%';
  }
  progress(percent) {
    this.elm.style.width = percent + '%';
    this.elm.textContent = percent + '%';
  }
  compliet() {
    this.elm.style.width = '100%';
    this.elm.textContent = '100%';
    setTimeout(()=>{this.elm.className='';}, 2000);
  }
  start() {
    this.elm  .className = 'loading';
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProgressBar;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class BinaryConverter {
  static binaryString2ArrayBuffer(binaryString) {
    return BinaryConverter.binaryString2Uint8Array(binaryString).buffer;
  }
  static arrayBuffer2BinaryString(buffer) {
    return BinaryConverter.uint8Array2BinaryString(new Uint8Array(buffer));
  }
  static arrayBuffer2base64(buffer) {
    return btoa(BinaryConverter.uint8Array2BinaryString(new Uint8Array(buffer)));
  }
  static arrayBuffer2DataURI(buffer, type = "application/octet-stream") {
    const base64 = btoa(BinaryConverter.arrayBuffer2BinaryString(buffer));
    return "data:" + type + ";base64," + base64;
  }

  static binaryString2Uint8Array(binaryString) {
    const list = binaryString.split("");
    const rawLength = binaryString.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = binaryString.charCodeAt(i);
    }
    return array;
  }

  static uint8Array2BinaryString(u8a) {
    let retList = [];
    for (let e of u8a) {
      retList.push(String.fromCharCode(e));
    }
    return retList.join("");
  }

  static binaryString2DataURI(binaryString, type = "application/octet-stream") {
    return "data:" + type + ";base64," + btoa(binaryString);
  }
  static base642DataURI(base64, type = "application/octet-stream") {
    return "data:" + type + ";base64," + base64;
  }
  static base642binaryString(base64) {
    return atob(base64);
  }
  static base642ArrayBuffer(base64) {
    return BinaryConverter.binaryString2ArrayBuffer(atob(base64));
  }

  static dataURI2BinaryString(dataURI) {
    return atob(dataURI.split(",")[1]);
  }
  static dataURI2ArrayBuffer(dataURI) {
    return BinaryConverter.binaryString2Uint8Array(atob(dataURI.split(",")[1]));
  }

  static uintArray2ArrayBuffer(uintArray) {
    return uintArray.buffer;
  }

  static arrayBuffer2Uint8Array(arrayBuffer) {
    return new Uint8Array(arrayBuffer);
  }

  static arrayBuffer2Uint16Array(arrayBuffer) {
    return new Uint16Array(arrayBuffer);
  }
  static arrayBuffer2Uint32Array(arrayBuffer) {
    return new Uint32Array(arrayBuffer)
  }

  static ArrayBuffer2Blob(val, type = "application/octet-stream") {
    return new Blob([val], {type: type});
  }
  static readBlob(blob) {
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onload = eve => {
        resolve(reader.result);
      }
      reader.onerror = eve => {
        reject(reader.error);
      }
    })

    return {
      asArrayBuffer() {
        reader.readAsArrayBuffer(blob);
        return promise;
      },
      asBinaryString() {
        reader.readAsBinaryString(blob);
        return promise;
      },
      asDataURL() {
        reader.readAsDataURL(blob);
        return promise;
      },
      asText() {
        reader.readAsText(blob);
        return promise;
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BinaryConverter;



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(6);
module.exports = __webpack_require__(24);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__view_mainFrame__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_mainService__ = __webpack_require__(2);


const title = "CopiBon";
const mainService = new __WEBPACK_IMPORTED_MODULE_1__service_mainService__["a" /* default */]();
class CopiBonService {
  static main(){

    const mf = new __WEBPACK_IMPORTED_MODULE_0__view_mainFrame__["a" /* default */](mainService);
    mf.render(title);
  }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = CopiBonService;

CopiBonService.main();


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__container__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__footer__ = __webpack_require__(23);




class MainFrame {
  constructor() {}
  render(titleText) {
    //alert("aaa");
    const frame = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("frame", "frame");
    const footer = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("footer", "footer");
    //alert(frame.appendChild);
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(frame,(new __WEBPACK_IMPORTED_MODULE_1__header__["a" /* default */]()).render(titleText));
    this.container = new __WEBPACK_IMPORTED_MODULE_2__container__["a" /* default */](frame);
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(frame,(new __WEBPACK_IMPORTED_MODULE_3__footer__["a" /* default */]()).render());
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].attachBody(frame);
  }
  
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MainFrame;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__ = __webpack_require__(0);

class Header {
  constructor() {}

  render(titleText) {
    const header = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("header", "header");
    const title = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("title", "title");
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].text(title, titleText)
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(header, title);
    return header;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Header;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseView__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__content_fileUploadArea__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__content_filesArea__ = __webpack_require__(20);




class Container extends __WEBPACK_IMPORTED_MODULE_1__baseView__["a" /* default */]{
  constructor(anker){
    super(anker);
    this.fua = new __WEBPACK_IMPORTED_MODULE_2__content_fileUploadArea__["a" /* default */](this.elm);
    this.fsa = new __WEBPACK_IMPORTED_MODULE_3__content_filesArea__["a" /* default */](this.elm);
    this.fua.addEventListeners(this.fsa.fp);
    this.fsa.fp.showFilesInit();
  }
  render() {
    const elm = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("container", "container");
    return elm;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Container;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__storageService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__viewPartsLoader__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__imageProcessService__ = __webpack_require__(16);




const title = "CopiBon";
const titlePrefix = "title_";
class MainServiceImpl {
  constructor() {
    this.vpl = new __WEBPACK_IMPORTED_MODULE_1__viewPartsLoader__["a" /* default */]();
    this.ss = new __WEBPACK_IMPORTED_MODULE_0__storageService__["a" /* default */]();
    this.ss.crateTitleStore();
    this.ip = new __WEBPACK_IMPORTED_MODULE_2__imageProcessService__["a" /* default */]();
  }
  async init() {
    await this.ss.loadAllData();
  }
  async save(pk,data) {
    let record = data?data:pk;
    await this.ss.save(data?pk:record.name, record);
  }
  async delete(pk) {
    await this.ss.delete(pk);
  }
  async loadImages() {
    this.ss.crateTitleStore();
    return await this.ss.loadAll();
  }
  async createThumbnail(arrayBuffer,width,height,type){
    const retURI = await this.ip.create(arrayBuffer,width,height,type);
    console.log(retURI);
    return retURI;
  }
  async registerImages(files){
    for (let file of files) {
      if (loaded.has(file.name)) {
        continue;
      }
      loaded.set(file.name, file.name);
      let arrayBuffer = await fue.readAsArrayBuffer(file);
      let arrayBufferA = bc.dataURI2ArrayBuffer(await this.ms.createThumbnail(arrayBuffer,100,100,file.type)) ;
      const data = {
        ab: arrayBufferA,
        name: file.name,
        type: file.type,
        modifyDate: file.lastModifiedDate.toLocaleDateString()
      };
      //console.log(data);
      data.pk = file.name;
      vu.insertFirst(this.elm, await this.crateDataLine(data));
      delete data.pk;
      this.save(data);
    }
  }
  getViewPartsLoader(){
    return this.vpl;
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = MainServiceImpl;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_idb_idbRapper__ = __webpack_require__(12);

const title = "CopiBon";
const titlePrefix="title_";
class StrageService {
  constructor(){
    this.idbAccessors = new Map();
  }
  async crateTitleStore(title ="default"){
    const storeNameKey = titlePrefix+title;
    this.idbAccessor = this.idbAccessors.has(storeNameKey)? this.idbAccessors.get(storeNameKey):new  __WEBPACK_IMPORTED_MODULE_0__util_idb_idbRapper__["a" /* default */](storeNameKey);
    this.idbAccessors.set(storeNameKey,this.idbAccessor);
  }
  async save(pk,data){
    await this.idbAccessor.saveDataDefault(pk,data);
  }
  async loadAll(){
    return await this.idbAccessor.loadAllData();
  }
  async get(key){
    return await this.idbAccessor.loadData(key);
  }
  async delete(key){
    return await this.idbAccessor.deleteData(key);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StrageService;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings_constant__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexeddbHelper__ = __webpack_require__(14);


class IdbRapper {

  constructor(objectStoreName, keypathName = "pk") {
    if (__WEBPACK_IMPORTED_MODULE_0__settings_constant__["a" /* default */].idbh === undefined) {
      __WEBPACK_IMPORTED_MODULE_0__settings_constant__["a" /* default */].idbh = new __WEBPACK_IMPORTED_MODULE_1__indexeddbHelper__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__settings_constant__["a" /* default */].dbName);
    }
    this.idbh = __WEBPACK_IMPORTED_MODULE_0__settings_constant__["a" /* default */].idbh;
    this.keyPathName = keypathName;
    this.objectStoreName = objectStoreName;
    //tableName, keyPathName
    this.firstPromise = this.idbh._createStore(objectStoreName, keypathName);
  }
  async isFished() {
    return new Promise((reslve, reject) => {
      this.firstPromise.then(() => {
        reslve(true);
      }, (e) => {
        throw e;
      })
    });
  }
  async saveDataDefault(key, data) {
    let record = {
      pk: key,
      data: data
    };
    //console.log("saveDataDefault 001:" + key + "/" + data);
    await this.saveData(record);
    //console.log("saveDataDefault 002:" + key + "/" + data);
  }
  async saveData(dataObj, key) {
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
    let value = await this.idbh._insertUpdate(this.objectStoreName, this.keyPathName, storeData);
    //console.log("saveData 004:" + key + "/" + dataObj+"/"+JSON.stringify(value)+"/"+value.data.data);
  }
  async loadData(key) {
    if (key !== undefined) {
      let recordAsLoadedData = await this.idbh._selectByKey(this.objectStoreName, key);
      //alert(recordAsLoadedData.data);
      return recordAsLoadedData;
    }
    return null;
  }
  async loadDataDefault(key) {
    let recordAsDefaultLoad = await this.loadData(key);
    return recordAsDefaultLoad === undefined || recordAsDefaultLoad === null
      ? null
      : recordAsDefaultLoad.data;
  }
  async loadAllData() {
    return await this.idbh._selectAll(this.objectStoreName);
  }
  async deleteData(key) {
    if (key !== undefined) {
      return await this.idbh._delete(this.objectStoreName, key);
    }
    return null;
  }
  async getOsNames() {
    return await this.idbh.getObjectStoreNames();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = IdbRapper;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const ua = navigator.userAgent.replace(/[\.0-9]+/g,"x");
const domain = window.location;
/* harmony default export */ __webpack_exports__["a"] = ({
  dbName:"CopiBon",
  ua:ua,
  domain:domain
});


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class IndexeddbHelper {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = IndexeddbHelper;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__view_parts_progressBar__ = __webpack_require__(3);

class ViewPartsLoader {
    constructor(){
    }
    getIndigator(){
      if(!!this.pb===false){
        this.pb = new __WEBPACK_IMPORTED_MODULE_0__view_parts_progressBar__["a" /* default */]();
      }
      return this.pb;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ViewPartsLoader;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_imageProcessor__ = __webpack_require__(17);


class ImageProcessService {
  constructor() {
    this.ip = new __WEBPACK_IMPORTED_MODULE_0__util_imageProcessor__["a" /* default */]();
  }
  async createThumbnail(arrayBuffer,type){
    const retURI = await this.ip.create(arrayBuffer,100,100,type);
    console.log(retURI);
    return retURI;
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ImageProcessService;



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__viewUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__binaryConverter__ = __webpack_require__(4);


class ImageProcessor {
  constructor() {
    this.canvas = __WEBPACK_IMPORTED_MODULE_0__viewUtil__["a" /* default */].createCanvas(null, "hidden");
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }
  setDataURI(dataURI) {
    this.dataURI = dataURI;
  }
  create(arrayBuffer, width, height, type) {
    return new Promise((resolve, reject) => {
      const imgElm = new Image();
      imgElm.src = __WEBPACK_IMPORTED_MODULE_1__binaryConverter__["a" /* default */].arrayBuffer2DataURI(arrayBuffer, type);
      imgElm.onload = () => {
        const widthScale = width / imgElm.width;
        const heightScale = height / imgElm.height;
        const scale = widthScale <= heightScale
          ? widthScale
          : heightScale;
        this.canvas.height = imgElm.height * scale;
        this.canvas.width = imgElm.width * scale;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.scale(scale, scale);
        this.ctx.drawImage(imgElm, 0, 0);
        //this.ctx.scale(1/scale, 1/scale);
        // console.log(imgElm.src);
        // console.log(scale);
        resolve(this.exportPng());
      };

      imgElm.onerror = (e) => {
        console.log('失敗');
        console.log(e);
        reject(null);
      };
    });
  }
  exportPng() {
    return this.canvas.toDataURL();
  }
  exportJpeg(quority = 1.0) {
    return this.canvas.toDataURL('image/jpeg', quority);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ImageProcessor;



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseView__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__eventHandler_fileUploader__ = __webpack_require__(19);



const text = "ここにファイルをアップロードしてください。";
class FileUploadArea extends __WEBPACK_IMPORTED_MODULE_1__baseView__["a" /* default */] {
  constructor(anker) {
    super(anker);
  }
  render() {
    const elm = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("fuaPArent", "frame");
    this.fileInput = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].createFile("FileUploadFile", "FileUploadFile", text);
    const area = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].createLabel("FileUploadArea", "FileUploadArea", text,"FileUploadFile");
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(elm, area);
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(elm, this.fileInput);
    return elm;
  }
  addEventListeners(fp) {
    this.fu = new __WEBPACK_IMPORTED_MODULE_2__eventHandler_fileUploader__["a" /* default */](fp);
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].on(this.fileInput, 'change', (e) => {
      this.fu.handleFileSelect(e)
    });
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].on(this.elm, 'dragover', (e) => {
      this.fu.handleDrop(e)
    });
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].on(this.elm, 'drop', (e) => {
      this.fu.handleDrop(e)
    });
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].on(this.elm, 'click', (e) => {
      this.fu.test(e);
      __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].emit(this.fileInput, 'click',false,false);
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FileUploadArea;



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__view_parts_progressBar__ = __webpack_require__(3);

class FileUploader {
  constructor(fileProcessor) {
    this.fileProcessor = fileProcessor;
    this.name = "FileUploader";
  }
  test(){
    //alert(this.name );
  }
  handleFileSelect(event) {
    event.stopPropagation(); // Stops some browsers from redirecting.
    event.preventDefault();
    let files = event.target.files; // FileList object
    this.handleFiles(files);
  }

  handleDrop(event){
    event.stopPropagation(); // Stops some browsers from redirecting.
    event.preventDefault();

    let files = event.dataTransfer.files;
    this.handleFiles(files);
  }
  handleFiles(files){
    this.fileProcessor.processFiles(files);
  }
  async areadParFile(file){
    return await areadParFile(file);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FileUploader;



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseView__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__parts_fileProcessor__ = __webpack_require__(21);



class FilesArea extends __WEBPACK_IMPORTED_MODULE_1__baseView__["a" /* default */] {
  constructor(anker) {
    super(anker);
    this.fp = new __WEBPACK_IMPORTED_MODULE_2__parts_fileProcessor__["a" /* default */](this.elm);
    this.files;
  }
  render() {
    const elm = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("FilesArea", "FilesArea");
    return elm;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FilesArea;



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_binaryConverter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__baseView__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_fileUploadExecuter__ = __webpack_require__(22);




const imgRe = /^image\/.+/;
const loaded = new Map();
class FileProseccor extends __WEBPACK_IMPORTED_MODULE_2__baseView__["a" /* default */] {
  constructor(anker) {
    super(anker);
    this.vpl = this.ms.getViewPartsLoader();
    this.pb = this.vpl.getIndigator();

  }
  render() {
    const elm = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].createUl("FileProseccor", "FileProseccor");
    return elm;
  }
  async processFiles(files) {
    const fue = new __WEBPACK_IMPORTED_MODULE_3__service_fileUploadExecuter__["a" /* default */](this.pb);
    for (let file of files) {
      if (loaded.has(file.name)) {
        continue;
      }
      loaded.set(file.name, file.name);
      let arrayBuffer = await fue.readAsArrayBuffer(file);
      let arrayBufferA = __WEBPACK_IMPORTED_MODULE_1__util_binaryConverter__["a" /* default */].dataURI2ArrayBuffer(await this.ms.createThumbnail(arrayBuffer,100,100,file.type)) ;
      const data = {
        ab: arrayBufferA,
        name: file.name,
        type: file.type,
        modifyDate: file.lastModifiedDate.toLocaleDateString()
      };
      //console.log(data);
      data.pk = file.name;
      __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].insertFirst(this.elm, await this.crateDataLine(data));
      delete data.pk;
      this.ms.save(data);
    }
  }
  async showFilesInit() {
    const datas = await this.ms.loadImages();
    for (let record of datas) {
      let {name, ab, type, modifyDate} = record.data;
      loaded.set(record.pk, name);
      let data = {
        pk: record.pk,
        name: name,
        ab: ab,
        type: type,
        modifyDate: modifyDate
      };
      __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(this.elm, await this.crateDataLine(data));
    }
  }
  remove(event, pk) {
    if (window.confirm("delete ok?")) {
      __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].removeChild(event.target.parentNode.parentNode);
      loaded.delete(pk);
      this.ms.delete(pk);
    }
  }
  async crateDataLine(data) {
    let {pk, name, ab, type, modifyDate} = data;
    const imgElm = await this.createImageNodeByData(data);
    const row = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].createLi();
    //console.log(row);
    const delButton = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create(null, "delButton", "☓");
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].on(delButton, "click", (e) => {
      this.remove(e, pk)
    });
    const size = (
      ab
      ? (new Uint8Array(ab)).length
      : 0);
    const dataLine = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create();
    const dataStrings = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].createSpan(null, "imageDataLine", escape(name) + ' (' + (
    type || 'n/a') + ') - ' + size + 'bytes, last modified: ' + modifyDate + ' size:' + data.width + 'x' + data.height);
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(dataLine, dataStrings);
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(dataLine, delButton);
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(row, dataLine);
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(row, imgElm);
    return row;
  }

  createImageNodeByData(data) {
    return new Promise((resolve, reject) => {
      let {name, ab, type} = data;
      let imgElm = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].createImage();
      imgElm.alt = escape(name);
      if (type && type.match(imgRe)) {
        //console.log(ab);
        imgElm.src = __WEBPACK_IMPORTED_MODULE_1__util_binaryConverter__["a" /* default */].arrayBuffer2DataURI(ab, type);
        //imgElm.src = bc.base642DataURI(base64, type);
        imgElm.onload = () => {
          data.height = imgElm.height;
          data.width = imgElm.width;
          resolve(imgElm);
        }
      } else {
        resolve(imgElm);
      }
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FileProseccor;



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mainService__ = __webpack_require__(2);

class FileUploadExecuter {
  constructor(indigator) {
    this.progress = indigator;
    this.name = "FileUploader";
    this.ms = __WEBPACK_IMPORTED_MODULE_0__mainService__["a" /* default */].getInstance();
  }
  async readAsArrayBuffer(file) {
    return await this.read(file, "ArrayBuffer");
  }
  async readAsBinaryString(file) {
    return await this.read(file, "BinaryString");
  }
  async readAsDataURL(file) {
    return await this.read(file, "DataURL");
  }
  async readAsText(file) {
    return await this.read(file, "text");
  }
  read(file, type = "binaryString") {
    return new Promise((resolve, reject) => {
      this.reader = new FileReader();
      this.progress.init();
      this.reader.onerror = (event) => {
        reject(this.errorHandler(event));
      };
      this.reader.onprogress = (event) => {
        this.updateProgress(event);
      };
      this.reader.onabort = (e) => {
        alert('File read cancelled');
      };

      this.reader.onloadstart = (event) => {
        this.onLoadStart(event)
      };
      this.reader.onload = (event) => {
        resolve(this.onload(event));
      };
      if (type === "ArrayBuffer") {
        this.reader.readAsArrayBuffer(file);
      } else if (type === "BinaryString") {
        this.reader.readAsBinaryString(file);
      } else if (type === "DataURL") {
        this.reader.readAsDataURL(file);
      } else {
        this.reader.readAsText(file);
      }
    })
  }
  abortRead() {
    if (this.reader) {
      this.reader.abort();
    }
  }
  errorHandler(event) {
    switch (event.target.error.code) {
      case event.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case event.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case event.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    };
  }

  updateProgress(event) {
    const percentLoaded = Math.round((event.loaded / event.total) * 100);
    if (percentLoaded < 100) {
      this.progress.progress(percentLoaded);
    }
  }
  onload(event) {
    return this.reader.result;
  }
  onLoadStart() {
    this.progress.start();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FileUploadExecuter;



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__ = __webpack_require__(0);

class Footer {
  constructor() {
    this.copyright = "ryunosinfx";
  }
  render(title) {
    const footer = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("footer", "footer");
    const copyright = __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].create("copyright", "copyright",this.copyright );
    __WEBPACK_IMPORTED_MODULE_0__util_viewUtil__["a" /* default */].append(footer, copyright);
    return footer;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Footer;



/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(27)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./node_modules/css-loader/index.js??ref--0-1!./index.css", function() {
			var newContent = require("!!./node_modules/css-loader/index.js??ref--0-1!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(26)(false);
// imports


// module
exports.push([module.i, "html, body {\n  min-height: 100%;\n  width: 100%;\n  padding: 0;\n  margin: 0;\n}\n\ndiv {\n  box-sizing: border-box;\n}\n\ndiv.frame {\n  min-height: 99%;\n  width: 100%;\n  margin-left: auto;\n  margin-right: auto;\n  margin: 0;\n  border: solid 1px blue;\n}\n\ndiv.footer {\n  min-height: 100%;\n  width: 100%;\n  border: solid 1px red;\n  padding: 0.5em;\n}\n\ndiv.copyright {\n  width: 100%;\n  padding: 0.5em;\n  text-align: center;\n}\n\ndiv.header {\n  min-height: 100%;\n  width: 100%;\n  border: solid 1px green;\n  padding: 0.2em;\n}\n\ndiv.title {\n  font-size: 2em;\n  font-weight: bold;\n  background-color: #c23cc1;\n  padding: 0.5em;\n}\n\nlabel.FileUploadArea {\n  display: block;\n  min-height: 100%;\n  width: 100%;\n  border: dotted 1px black;\n  background-color: #a8bae0;\n  padding-top: 5em;\n  padding-bottom: 5em;\n  text-align: center;\n  font-size: 2em;\n}\n\ninput.FileUploadFile {\n  position: absolute;\n  top: -10em;\n  left: 10em;\n  visibility: hidden;\n}\n\ndiv.FilesArea {\n  min-height: 100%;\n  width: 100%;\n  border: dotted 1px black;\n  background-color: rgb(124, 110, 241);\n  padding-top: 1em;\n  padding-bottom: 1em;\n  text-align: center;\n  font-size: 2em;\n}\n\nspan.imageDataLine {\n  display: inline-block;\n  font-size: 50%;\n  padding: 0.2em;\n}\n\ndiv.delButton {\n  display: inline-block;\n  font-size: 50%;\n  width: 3em;\n  padding: 0.2em;\n  line-height: 1em;\n  text-align: center;\n  cursor: pointer;\n  background-color: #675275;\n}\n\ndiv.delButton:active {\n  color: red;\n}\n\ndiv.delButton:hover {\n  color: #d48a60;\n  background-color: #7b4f99;\n}\ncanvas.hidden {\n  \n}\n\n[draggable] {\n  user-select: none;\n}\n\n.column {\n  height: 150px;\n  width: 150px;\n  float: left;\n  border: 2px solid #666666;\n  background-color: #ccc;\n  margin-right: 5px;\n  border-radius: 10px;\n  box-shadow: inset 0 0 3px #000;\n  text-align: center;\n  cursor: move;\n}\n\n.column.over {\n  border: 2px dashed #000;\n}\n\n.column header {\n  color: #fff;\n  text-shadow: #000 0 1px;\n  box-shadow: 5px;\n  border-bottom: 1px solid #ddd;\n  border-top-left-radius: 10px;\n  border-top-right-radius: 10px;\n}\n", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(28);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 28 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map