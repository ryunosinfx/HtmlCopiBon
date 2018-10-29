import { BaseView } from "../../../util/reactive/baseView";
import {
	a,
	div,
	li,
	ul,
	img,
	span,
	input,
	label
} from "../../../util/reactive/base/vtags";

import { unixTimeToDateFormat } from "../../../util/timeUtil";
import { ExportActionCreator } from '../../../reduxy/action/exportActionCreator'
import { getNowUnixtime } from "../../../util/timeUtil";
import { Dialog } from "../dialog/dialog";
export class ExportImgZipButton extends BaseView {
	constructor() {
		super("ExportImgZipButton", "ExportImgZipButton", true);
		this.storeSelectedOrderKey = ExportActionCreator.getStoreSelectedOrderKey();
		this.storeKey = ExportActionCreator.getStoreKey();
		this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
		this.storeZipDLKey = ExportActionCreator.getStoreZipDLKey();
		this.storeRemoveResultKey = ExportActionCreator.getStoreRemoveResultKey();
		this.storeExportResultKey = ExportActionCreator.getStoreExportResultKey();
		this.stateId = "exportedStateZip";
		this.isExported = false;
		this.exportOrderData = null;
		this.startTime = null;
	}

	render(store, actionData) {
		const buttonName = div("", ["buttonName"], "make zip!");
		const exportedState = div(this.stateId, ["exportedStateNone"], "no export");
		return div(this.id, [this.id + "Frame"], {
			on: {
				click: this.click()
			}
		}, [div("", ["button"], [buttonName, exportedState])]);
	}
	async onAfterAttach(store, data) {}

	async onViewShow(store, actionData) {
		if (store[this.storeExportResultKey]) {
			const data = store[this.storeExportResultKey];
			const zip = data.zip;
			const isSuccess = this.buildButton(data);
			const duration = (getNowUnixtime() - this.startTime) / 1000;
			if (isSuccess && this.startTime) {
				this.startTime = null;
				setTimeout(() => {
					Dialog.opneAlert("Build Zip File Complete!", "OK download zip file! " + zip.size + "byte  Duration:" + duration + "sec");
				}, 1000)
				//":" + JSON.stringify(store[this.storeExportResultKey]) + "/this.isExported:" + this.isExported);
			}
		} else if (store[this.storeKey]) {
			//alert(JSON.stringify(store[this.storeKey]));
			this.buildButton(store[this.storeKey]);
		}

		if (store[this.storeSelectedOrderKey]) {
			const orderData = store[this.storeSelectedOrderKey];
			const selectOptions = orderData.selectOptions;
			const selectOrder = orderData.selectOrder;
			this.exportOrderData = {
				basePaper: selectOrder.basePaper,
				orderName: selectOrder.orderName,
				dpiName: selectOptions.dpiName,
				isGrayscale: selectOptions.isGrayscale,
				isMaxSize10M: selectOptions.isMaxSize10M,
				isLanczose: selectOptions.isLanczose
			}
		}
	}
	buildButton(exports) {
		if (exports && exports.zip) {
			const zip = exports.zip
			const exportString = "*Last Exported One* " + zip.name + " / " + zip.orderName + " /size: " + zip.size + "byte / " + unixTimeToDateFormat(zip.updateDate);
			this.prePatch("#" + this.stateId, div(this.stateId, ["exportedState"], exportString));
			this.isExported = true;
			return true;
			// console.log(data);
			//alert("OK download zip file!:" + JSON.stringify(exports) + "/this.isExported:" + this.isExported);

		} else {
			this.isExported = false;
			this.prePatch("#" + this.stateId, div(this.stateId, ["exportedStateNone"], "no export"));
			return false;
			// console.log(data);
			//alert("OK download zip file!:" + JSON.stringify(exports) + "/this.isExported:" + this.isExported);
		}
	}

	click() {
		return async (event) => {
			if (!this.exportOrderData) {
				Dialog.opneAlert("I'm need ExportSettings!", "Export Order is not Selected!");
				// alert("Export Order is not Selected!");
				return
			}
			const result = await Dialog.opneConfirm("Comfirm", "is export orverride ok?");
			if (!this.isExported || this.isExported && result) {
				this.startTime = getNowUnixtime();
				const action = ExportActionCreator.createExecuteAction(this, { exportOrders: [this.exportOrderData] });
				this.dispatch(action);
			}
			event.stopPropagation();
			return false;
		}
	}
}