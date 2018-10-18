import {
  RefObject
} from '../base/refObject'
import {
  BinaryUtil
} from '../util/binaryUtil'
import {
  UnicodeEncoder
} from '../util/unicodeEncoder'
export class ImageResourcesObject extends RefObject {
  constructor(imageId) {
    super();
    this.setElm('ProcSet', ['PDF','ImageC']);
    this.imageId = imageId;
    this.jpegDataUri = jpegDataUri;
  }
  setImageXObject(imageXObject){
      const xObjectMap = new RefObject();
      xObjectMap.setBePlaneMap();
      const imageId = imageXObject.getImageId(;)
      xObjectMap.setElm(imageId, imageXObject);
  }
}
