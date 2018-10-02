
import {RefObject} from '../base/refObject'
export class CatalogObject extends RefObject {
  constructor(pagesObj) {
    super();
    this.setElm('Type','Catalog');
    this.setElm('Pages',pagesObj);
  }
  toArrayBuffer(){

  }
  convertStr2Ab(str){

  }
}
