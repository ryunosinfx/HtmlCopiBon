
import {RefObject} from '../base/refObject'
export class PageObject extends RefObject {
  constructor(sizeName="A4") {
    super();
    this.setElm('Type','Page');
  }
  setParent(parent){

  }
}
