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
  }
  createExport() {

  }
  static getRefMap() {
    return refMap;
  }
  static getRefList() {
    return refList;
  }
  addRefMap() {
    refList.push(this);
    let index = 1;
    for (let obj of refList) {
      refMap.set(obj, index + " 0 ");
      index++;
    }
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
  createObject() {
    let retText = '';

    return retText;
  }
  createStream() {}
}
