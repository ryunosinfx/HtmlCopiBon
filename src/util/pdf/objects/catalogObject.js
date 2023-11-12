import { RefObject } from '../base/refObject.js';
export class CatalogObject extends RefObject {
	constructor(pagesObj) {
		super();
		this.setElm('Type', 'Catalog');
		this.setElm('Pages', pagesObj);
		// this.setElm('Version', 0);
		this.registerAfterRefMap(pagesObj);
		this.isRoot = true;
	}
}
