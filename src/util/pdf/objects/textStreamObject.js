import {
  RefObject
} from '../base/refObject'
import {
  BinaryUtil
} from '../util/binaryUtil'
import {
  UnicodeEncoder
} from '../util/unicodeEncoder'
export class TextStreamObject extends RefObject {
  constructor(pagesObj) {
    super();
    this.setElm('Length', 0);
    this.texts = [];
    this.streamArea = {
      offsetX: 0,
      offsetY: 0,
      width: 0,
      height: 0
    };

  }
  setParentPage(pageObj) {
    this.pageObj = pageObj;
    this.pageWidth = this.pageObj.width;
    this.pageHeight = this.pageObj.height;
    this.fontName = this.pageObj.getFontName();
  }
  setStreamArea(offsetX, offsetY, width, height) {
    this.streamArea.offsetX = offsetX;
    this.streamArea.offsetY = offsetY;
    this.streamArea.width = width;
    this.streamArea.height = height;
  }
  addText(text, offsetX, offsetY, fontId, fontSize) {
    this.texts.push({
      text,
      offsetX,
      offsetY,
      fontId,
      fontSize
    });
  }
  createStream() {
    const NEWLINE = RefObject.getNewLine();
    const rett = [];
    const retText = ''
    rett.push(RefObject.getAsU8a('stream'));
    //1. 0. 0. 1. 50. 720. cm
    retText += '1. 0. 0. 1. '+this.streamArea.offsetX+'. '+(this.pageHeight-this.streamArea.offsetY)+'. cm'+NEWLINE;
    retText += 'BT'+NEWLINE;
    for (let text of this.texts) {
      /F0 36 Tf
      1. 0. 0. 1. 50. 720. Tm
      40 TL
      (Hello, world!) Tj T*
    }
    retText += 'ET'+NEWLINE;
    const u8a = RefObject.getAsU8a(retText));
  const length = u8a.length;
  this.setElm('Length', length);
  rett.push(u8a);
  rett.push(RefObject.getAsU8a('endstream'));
  return u8a;
}
}
