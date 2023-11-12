import { BaseView } from '../../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../../util/reactive/base/vtags.js';
import { dpis, ExportOrders } from '../../../settings/exportSettings.js';
import { ExportActionCreator } from '../../../reduxy/action/exportActionCreator.js';
export class ExportOrderRow extends BaseView {
	constructor(parent) {
		super('ExportOrderRow', 'ExportOrderRow');
		this.parent = parent;
		this.selectOrder = null;
		this.ordersMap = {};
		this.orderOptions = { isGrayscale: false, dpiName: 'dpi72', isMaxSize10M: false, isLanczose: false };
		this.activeClassName = 'active';
	}

	render(store, actionData) {
		const name = div('', ['TitleName'], 'TitleName');
		return div('', [this.id + 'Frame'], [name, div(this.imageAreaID, ['ImageDetailA'], this.id + 'aaaaa')]);
	}
	async onAfterAttach(store, data) {}

	async onViewShow(store, actionData) {}
	getCurrentSelected() {
		return this.ordersMap[this.selectOrder];
	}
	getSelectOrder(name) {
		return (event) => {
			if (name) {
				this.selectOrder = name;
			}
			const action = ExportActionCreator.createSelectOrderAction(this.parent, {
				selectOrder: this.ordersMap[this.selectOrder],
				selectOptions: this.parent.getCurrentOptions(),
			});
			this.dispatch(action);
			event.stopPropagation();
			return false;
		};
	}

	buildRows(exportOrderData) {
		const retList = [];
		const ordersList = ExportOrders;
		const selectOrder = exportOrderData && exportOrderData.selectOrder ? exportOrderData.selectOrder : null;
		for (const order of ordersList) {
			const name = order.orderName;
			const activeClass =
				selectOrder && selectOrder.orderName && order.orderName === selectOrder.orderName
					? this.activeClassName
					: '';
			this.ordersMap[name] = order;
			const label = span('', [name + 'Text'], [name]);
			const id = 'ExportOrderRow-' + name;
			const row = div(
				id,
				[name, activeClass],
				{
					on: { click: this.getSelectOrder(name) },
				},
				[label]
			);
			retList.push(row);
		}
		return retList;
	}
}
