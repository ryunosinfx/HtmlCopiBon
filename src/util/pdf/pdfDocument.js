import {
  RefObject
} from './base/refObject'
import {
  Header
} from './base/header'
import {
  BinaryUtil
} from './util/binaryUtil'
import {
  CatalogObject
} from './objects/catalogObject'
import {
  FontObject
} from './objects/fontObject'
import {
  ImageContentsObject
} from './objects/imageContentsObject'
import {
  ImageResourcesObject
} from './objects/imageResourcesObject'
import {
  ImageXObject
} from './objects/imageXObject'
import {
  InfoObject
} from './objects/infoObject'
import {
  PageObject
} from './objects/pageObject'
import {
  PagesObject
} from './objects/pagesObject'
import {
  TextStreamObject
} from './objects/textStreamObject'
import {
  TrailerObject
} from './objects/trailerObject'
export class PdfDocument {
  constructor(pageSizse) {
    this.pageSize = pageSizse;
    this.info = new InfoObject();
    this.pages = new PagesObject();
    this.root = new CatalogObject(this.pages);
    this.trailer = new TrailerObject();
    this.trailer.setRoot(this.root);
    this.trailer.setInfo(this.info);
    this.imageCount=0;
  }
  addDummyPage(){

  }
  addImagePage(dataUri){
    const imageId = 'img'+this.imageCount;
    const ic = new ImageContentsObject(imageId);
    const ir = new ImageResourcesObject(imageId);
    const page =new Pagesbject(this.pageSize);
    this.pages.addPage(page);
    page.setContents(ic);
    page.setResources(ir);
    ir
    const page =new Pagesbject(this.pageSize);


    this.imageCount++;
  }
  createFile(){
    const retArray = [];
    retArray.push(Header.getU8a());

    return BinaryUtil.joinU8as(retArray);
  }
}
