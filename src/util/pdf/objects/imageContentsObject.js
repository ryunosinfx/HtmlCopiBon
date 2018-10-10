import {
  RefObject
} from '../base/refObject'
import {
  BinaryUtil
} from '../util/binaryUtil'
import {
  UnicodeEncoder
} from '../util/unicodeEncoder'
export class ImageContentsObject extends RefObject {
  constructor(imageId) {
    super();
    this.setElm('Length', 0);
    this.imageId = imageId;
  }
  setParentPage(pageObj) {
    this.pageObj = pageObj;
    this.pageWidth = this.pageObj.width;
    this.pageHeight = this.pageObj.height;
  }
  createStream() {
    const NEWLINE = RefObject.getNewLine();
    const rett = [];
    const retText = ''
    rett.push(RefObject.getAsU8a('stream'));
    //1. 0. 0. 1. 50. 720. cm
    retText += 'q' + NEWLINE;
    retText += '1 0 0 1 '+this.pageWidth+' '+this.pageHeight+' cm' + NEWLINE;
    retText += '/'+this.imageId+' Do' + NEWLINE;
    retText += 'Q' + NEWLINE;
    const u8a = RefObject.getAsU8a(retText);
    const length = u8a.length;
    this.setElm('Length', length);
    rett.push(u8a);
    rett.push(RefObject.getAsU8a('endstream'));
    return u8a;
  }
}
