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
export class DownloadUploadedImgZipButton extends BaseView {
	constructor() {
		super("DownloadUploadedImgZipButton", "DownloadUploadedImgZipButton", true);
		this.storeUploadedImgZipDLKey = ExportActionCreator.getStoreUploadedImgZipDLKey();
		this.stateId = this.id + "Button";
		this.isExported = false;
	}

	render(store, actionData) {
		const text = div(this.stateId, [
			"button", "enable"
		], "-Download Uploaded Images Zip-");
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
		if (store[this.storeUploadedImgZipDLKey]) {
			const output = store[this.storeUploadedImgZipDLKey];
			if (output) {
				if (output.ab) {
					FileDownloader.download(output.name, output.ab, "application/zip");
				}
			}
		}
	}
	click() {
		return (event) => {
			const action = ExportActionCreator.createDownloadImgAction(); //createDownloadPdfAction
			this.dispatch(action);
			event.stopPropagation();
			return false;
		}
	}
}