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
		this.imageCount = 0;
	}
	addDummyPage() {
		const page = new PageObject(this.pageSize);
		//this.pages.addPage(page);
	}
	addImagePage(dataUri, ab, width, height) {
		if (!dataUri && !ab) {
			this.addDummyPage();
			return;
		}
		const imageId = 'img' + this.imageCount;
		const ic = new ImageContentsObject(imageId);
		const ir = new ImageResourcesObject(imageId);
		const page = new PageObject(this.pageSize);
		const binaryU8a = ab && ab.byteLength > 0 ? new Uint8Array(ab) : BinaryUtil.convertDataUri2U8a(dataUri);
		const imageXobj = new ImageXObject(imageId, binaryU8a, width, height);
		this.pages.addPage(page);
		page.setContents(ic);
		page.setResources(ir);
		ir.setImageXObject(imageXobj);
		this.imageCount++;
	}
	createFile() {
		const retArray = [];
		const headerU8a = Header.getU8a();
		console.log("headerU8a:" + headerU8a.byteLength);
		retArray.push(headerU8a);
		const body = this.trailer.createXref(headerU8a.byteLength);
		retArray.push(body);
		return BinaryUtil.joinU8as(retArray);
	}
}