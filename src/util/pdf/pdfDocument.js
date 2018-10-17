import {
  RefObject
} from './base/refObject'
import {
  Header
} from './base/header'
import {
  BinaryUtil
} from './util/binaryUtil'
export class PdfDocument {
  constructor(pageSizse) {
    this.pageSize = pageSizse;
  }
  addDummyPage(){

  }
  addImagePage(dataUri){

  }
  createFile(){
    const retArray = [];
    retArray.push(Header.getU8a());
    
    return BinaryUtil.joinU8as(retArray);
  }
}
