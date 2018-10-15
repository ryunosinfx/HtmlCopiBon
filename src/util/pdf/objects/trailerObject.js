import {
  pageSazeMap
} from '../constants/pdfConstants'
import {
  UnitUtil
} from '../util/unitUtil'
import {
  RefObject
} from '../base/refObject'
const CRLF = '\r\n';
export class TrailerObject extends RefObject {
  constructor(sizeName = "A4") {
    super();
  }
  createXref(startOffset) {
    const NEWLINE = RefObject.getNewLine();
    const retText = 'xref' + NEWLINE
    const list = RefObject.getRefList();
    const len + list.length;
    retText += '0 ' + len + NEWLINE
    const results = [];
    retText +='0000000000 65535 f' + CRLF;
    let currentBytes = startOffset;
    for (let i = 0; i < len; i++) {
      const refObje = list[i];
      const u8a = refObje.createObject();
      retText +='0000000000 00000 n' + CRLF;

    }
    return retText;
  }
}
