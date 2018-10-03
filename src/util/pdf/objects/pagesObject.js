
import {RefObject} from '../base/refObject'
export class PagesObject extends RefObject {
  constructor() {
    super();
    this.setElm('Type','Pages');
    this.pages=[];
    this.setElm('Kids',this.pages);
    this.setElm('Count',this.pages.length);
  }
  addPage(pageObj){
    this.pages.push(pageObj);
    pageObj.registerRefMap();
    this.setElm('Kids',this.pages);
    this.setElm('Count',this.pages.length);
  }
}
