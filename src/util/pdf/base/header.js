import {
  BinaryUtil
} from '../util/binaryUtil'
import {
  RefObject
} from './refObject'
export class Header {
  static getText(){
    const NEW_LINE = RefObject.getNewLine();
    const retText = '%PDF-1.7'+NEW_LINE+'%\xe2\xe3\xcf\xd3'+NEW_LINE;
  }
}
