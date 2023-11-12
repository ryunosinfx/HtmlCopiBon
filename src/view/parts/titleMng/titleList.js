import { BaseView } from '../../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../../util/reactive/base/vtags.js';
import { TitleActionCreator } from '../../../reduxy/action/titleActionCreator.js';
import { TitleRow } from './titleRow.js';
export class TitleList extends BaseView {
	constructor() {
		super('TitleList', 'TitleList');
		this.storeKey = TitleActionCreator.getStoreKey();
		this.storeCurrentKey = TitleActionCreator.getStoreCurrentKey();
		this.titleRow = new TitleRow();
	}

	render(store, actionData) {
		const name = div('', ['TitleListName'], 'Titles List');
		const listView = div('', ['TitleListRows'], this.id + '-----------');
		return div('', [this.id + 'Frame'], [name, listView]);
	}
	async onAfterAttach(store, data) {}

	async onViewShow(store, actionData) {
		if (store[this.storeKey]) {
			const { list, totalSize } = store[this.storeKey];
			this.buildRows(list);
		} else if (store[this.storeCurrentKey]) {
			alert('bbbbbb');
		}
	}

	buildRows(list) {
		const listRows = this.titleRow.buildRows(list);
		const vnode = div('', ['TitleListRows'], listRows);
		this.prePatch('.TitleListRows', vnode);
	}
}
