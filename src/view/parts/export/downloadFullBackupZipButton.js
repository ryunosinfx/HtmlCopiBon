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
import { FileDownloader } from "../../../util/fileDownloader";
export class DownloadFullBackupZipButton extends BaseView {
	constructor() {
		super("DownloadFullBackupZipButton", "DownloadFullBackupZipButton", true);
		this.storeFullBackupZipDLKey = ExportActionCreator.getStoreFullBackupZipDLKey();
		this.stateId = this.id + "Button";
		this.isExported = false;
	}

	render(store, actionData) {
		const text = div(this.stateId, [
			"button", "enable"
		], "-Download Full Backup Zip-");
		const result = div(this.id, [
			this.id + "Frame"
		], {
			on: {
				click: this.click()
			}
		}, [text]);
		// alert("render this.isExported :" + this.isExported+'/this.id:'+this.id);
		return result;
	}
	async onAfterAttach(store, data) {
		// alert("onAfterAttach this.isExported :" + this.isExported+'/this.id:'+this.id);
	}

	async onViewShow(store, actionData) {
		if (store[this.storeFullBackupZipDLKey]) {
			const data = store[this.storeFullBackupZipDLKey];
			const pdf = data.pdf;
			if (pdf) {
        // const exportString = zip.name + " / " + zip.orderName + " / " + unixTimeToDateFormat(zip.updateDate);
        const text = div(this.stateId, [
          "button", "enable"
        ],{
          on: {
            click: this.click()
          }
        }, "Download Full Backup Zip!");
        this.prePatch("#" + this.stateId, text);
			}
		} else {}
	}
	click() {
		return (event) => {
			if (this.isExported) {
				const action = ExportActionCreator.createDownloadFullBKAction(); //createDownloadPdfAction
				this.dispatch(action);
			}
			event.stopPropagation();
			return false;
		}
	}
}
