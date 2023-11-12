import { BaseView } from '../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../util/reactive/base/vtags.js';
import { ExportButton } from '../parts/export/exportButton.js';
import { ExportOrderList } from '../parts/export/exportOrderList.js';

import { ExportActionCreator } from '../../reduxy/action/exportActionCreator.js';
export class ExportArea extends BaseView {
	constructor() {
		super('ExportArea', 'ExportArea');
		this.text = 'ExportArea';
		this.exportButton = new ExportButton();
		this.exportOrderList = new ExportOrderList();
	}

	async onAfterAttach(store, data) {
		await this.exportOrderList.attach(this);
		await this.exportButton.attach(this);
		const action = ExportActionCreator.creatLoadAction();
		await this.dispatch(action);
	}
	render() {
		return div(
			this.id,
			['ExportArea'],
			[div('', ['ExportAreaTitle'], this.text), div(this.exportOrderList.id), div(this.exportButton.id)]
		);
	}
}
