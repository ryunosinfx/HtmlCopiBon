import { BaseView } from '../../../util/reactive/baseView.js';
import { a, div, li, ul, createSelectVnode, span, label, checkbox } from '../../../util/reactive/base/vtags.js';
import { ExportActionCreator } from '../../../reduxy/action/exportActionCreator.js';
import { ExportOrderRow } from './exportOrderRow.js';
import { dpis, ExportOrders } from '../../../settings/exportSettings.js';
export class ExportOrderList extends BaseView {
	constructor() {
		super('ExportOrdrList', 'ExportOrdrList');
		this.exportOrderRow = new ExportOrderRow(this);
		this.storeSelectedOrderKey = ExportActionCreator.getStoreSelectedOrderKey();
		this.listFrameId = this.id + 'ListFrame';
		this.listId = this.id + 'List';
		this.checkboxIsGrascale = 'checkboxIsGrascaleAt' + this.Id;
		this.selectBoxDpiName = 'selectBoxDpiNameAt' + this.Id;
		this.checkboxIsMaxSize10M = 'checkboxIsMaxSize10MAt' + this.Id;
		this.checkboxIsLanczose = 'checkboxIsLanczoseAt' + this.Id;
		this.checkboxIsSaddleStitchingOrder = 'checkboxIsSaddleStitchingOrder' + this.Id;
	}

	render(store, actionData) {
		const inputFrameClass = 'ExportOrdrs';
		const name = div('', [inputFrameClass], 'Export Orders List');
		////
		const inputClass = 'ExportOrdersOptions';
		const checkboxIsGrascale = label(
			'',
			[inputClass],
			[
				checkbox(
					this.checkboxIsGrascale,
					[''],
					{
						on: { change: this.exportOrderRow.getSelectOrder() },
					},
					''
				),
				'isGrayscale?',
			]
		);
		const dpiList = {};
		let firstKey = '';
		for (const dpiName in dpis) {
			firstKey = dpis[dpiName];
			break;
		}

		const selectBoxDpiName = label(
			'',
			[inputClass],
			[
				' ',
				createSelectVnode(this.selectBoxDpiName, [], '', dpis, dpiList[firstKey], {
					change: this.exportOrderRow.getSelectOrder(),
				}),
				'dpi',
			]
		);
		const checkboxIsMaxSize10M = label(
			'',
			[inputClass],
			[
				checkbox(
					this.checkboxIsMaxSize10M,
					[''],
					{
						on: { change: this.exportOrderRow.getSelectOrder() },
					},
					''
				),
				'isMaxSize10MB/Paper?',
			]
		);
		const checkboxIsLanczose = label(
			'',
			[inputClass],
			[
				checkbox(
					this.checkboxIsLanczose,
					[''],
					{
						on: { change: this.exportOrderRow.getSelectOrder() },
					},
					''
				),
				'isLanczose Or ByCubic?',
			]
		);
		const checkboxIsSaddleStitchingOrder = label(
			'',
			[inputClass],
			[
				checkbox(
					this.checkboxIsSaddleStitchingOrder,
					[''],
					{
						on: { change: this.exportOrderRow.getSelectOrder() },
					},
					''
				),
				'is Saddle Stitching Order At PDF?',
			]
		);
		const exportOptions = div(
			'',
			[inputFrameClass],
			[
				'Options:',
				selectBoxDpiName,
				checkboxIsGrascale,
				checkboxIsMaxSize10M,
				checkboxIsLanczose,
				checkboxIsSaddleStitchingOrder,
			]
		);
		////
		const list = div(this.listFrameId, [inputFrameClass], this.buildRows());
		return div(this.listId, [this.id + 'Frame'], [name, list, exportOptions]);
	}
	async onAfterAttach(store, data) {}

	async onViewShow(store, actionData) {
		if (store[this.storeSelectedOrderKey]) {
			const inputFrameClass = 'ExportOrdrs';
			const selectOrderData = store[this.storeSelectedOrderKey];
			const list = div(this.listFrameId, [inputFrameClass], this.buildRows(selectOrderData));
			this.prePatch('#' + this.listFrameId, list);
		}
	}
	getCurrentOptions() {
		const result = {
			isGrayscale: document.getElementById(this.checkboxIsGrascale).checked,
			dpiName: document.getElementById(this.selectBoxDpiName).value,
			isMaxSize10M: document.getElementById(this.checkboxIsMaxSize10M).checked,
			isLanczose: document.getElementById(this.checkboxIsLanczose).checked,
			isSaddleStitchingOrder: document.getElementById(this.checkboxIsSaddleStitchingOrder).checked,
		};
		return result;
	}

	buildRows(selectOrderData = null) {
		return this.exportOrderRow.buildRows(selectOrderData);
	}
}
