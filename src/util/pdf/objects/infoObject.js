
import {RefObject} from '../base/refObject'
export class InfoObject extends RefObject {
  constructor(pagesObj) {
    super();
    this.setElm('Type','Info');
    this.setElm('Pages',pagesObj);
    this.setElm('Version',0);
    this.registerAfterRefMap(pagesObj);
  }
}
