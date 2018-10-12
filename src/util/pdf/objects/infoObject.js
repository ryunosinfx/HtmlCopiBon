
import {RefObject} from '../base/refObject'
export class InfoObject extends RefObject {
  constructor() {
    super();
    this.setElm('Type','Info');
    this.setElm('Creator','pagesObj');
    this.setElm('CreationDate','pagesObj');
    this.setElm('ModDate','pagesObj');
    this.setElm('Producer','pagesObj');
  }
}
