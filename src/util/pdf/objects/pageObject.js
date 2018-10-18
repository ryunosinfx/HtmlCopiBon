import {
  pageSazeMap
} from '../constants/pdfConstants'
import {
  UnitUtil
} from '../util/unitUtil'
import {
  RefObject
} from '../base/refObject'
export class PageObject extends RefObject {
  constructor(sizeName = "A4") {
    super();
    this.setElm('Type', 'Page');
    const paperSizeMm = pageSazeMap[sizeName];
    const paperSizePoint = UnitUtil.conertMmToPointArray(paperSizeMm);
    this.width = paperSizePoint[2];
    this.height = paperSizePoint[3];
    this.setElm('MediaBox', paperSizePoint);
  }
  setParent(parent) {
    this.setElm('Parent', parent);
  }
  setResources(resources) {
    this.setElm('Resources', resources);
    resources.registerRefMap();
  }
  setContents(contents) {
    if(contents.setParentPage){
      contents.setParentPage(this);
    }
    this.setElm('Contents', contents);
    contents.registerRefMap();
  }
  getFontName(){
    return this.fontName;
  }
}
