import { RefObject } from '../base/refObject'
import { getNow } from '../util/pdfTimeUtil'
export class InfoObject extends RefObject {
	constructor() {
		super();
		this.setElm('Type', 'Info');
		this.setElm('Creator', 'It is me!');
		this.setElm('CreationDate', getNow());
		this.setElm('ModDate', getNow());
		this.setElm('Producer', 'aaa');
		this.isInfo = true;
	}
}