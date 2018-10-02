import {
  BinaryUtil
} from '../util/binaryUtil'
import {
  KeyKeywords
} from '../constants/pdfConstants'
const refMap = new Map();
const NEWLINE = '\r\n';
const refMap = new Map();
const refList = [];
export class RefObject {
  constructor() {
    this.exportText = '';
    this.map = {};
    this.isBePlaneMap = false;
    this.afterRegsterRefMap =[];
  }
  createExport() {

  }
  static getRefMap() {
    return refMap;
  }
  static getRefList() {
    return refList;
  }
  registerRefMap(obj) {
    this.afterRegsterRefMap.push(obj);
  }
  registerRefMap() {
    refList.push(this);
    let index = 1;
    for (let obj of refList) {
      refMap.set(obj, index + " 0 ");
      index++;
    }
    for(let obj of this.afterRegsterRefMap){
      obj.registerRefMap();
    }
  }
  getRefNo() {
    return refMap.get(this);
  }
  isRegisterd() {
    return refMap.has(this);
  }
  setBePlaneMap() {
    this.isBePlaneMap = true;
  }
  setElm(key, value) {
    this.map[key] = value;
  }
  static getNewLine() {
    return NEWLINE;
  }
  createFile() {}
  createObject(value) {
    let retText = '';
    if (value === null || value === undefined) {

    } else if (typeof value === 'string') {
      if (KeyKeywords[value]) {
        retText += "/" + value;
      } else {
        retText += "(" + value + ')';
      }
    } else if (typeof value === 'number') {
      retText += value;
    } else if (typeof value === 'object' && Array.isArray(value)) {
      const newArray = [];
      for (let val of value) {
        newArray.push(this.createObject(val));
      }
      retText += '[ ' + newArray.join(' ') + ' ]';
    } else if (typeof value === 'object' && value.isRegisterd && value.isRegisterd()) {

    } else if (typeof value === 'object') {
      retText += '<<' + NEWLINE
      for (let key in value) {
        const val = value[key]
        const row = '/' + key + ' ' + this.createObject(val);
        retText += row + NEWLINE;
      }
      retText += '>>' + NEWLINE;
    }
    return retText;
  }
  createStream() {}
}
