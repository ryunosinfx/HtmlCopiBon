import { BaseView } from '../../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../../util/reactive/base/vtags.js';
import { ExportActionCreator } from '../../../reduxy/action/exportActionCreator.js';
import { FileDownloader } from '../../../util/fileDownloader.js';
export class DownloadLastExportPdfButton extends BaseView {
	constructor() {
		super('DownloadLastExportPdfButton', 'DownloadLastExportPdfButton', true);
		this.storeKey = ExportActionCreator.getStoreKey();
		this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
		this.stateId = this.id + 'Button';
		this.isExported = false;
	}

	render(store, actionData) {
		const text = div(this.stateId, ['button', 'disable'], '-no export PDF-');
		const result = div(
			this.id,
			[this.id + 'Frame'],
			{
				on: {
					click: this.click(),
				},
			},
			[text]
		);
		// alert("render this.isExported :" + this.isExported+'/this.id:'+this.id);
		return result;
	}
	async onAfterAttach(store, data) {
		// alert("onAfterAttach this.isExported :" + this.isExported+'/this.id:'+this.id);
	}

	async onViewShow(store, actionData) {
		if (store[this.storePdfDLKey]) {
			const output = store[this.storePdfDLKey];
			if (output.ab) {
				FileDownloader.download(output.name, output.ab, 'application/pdf');
			} else {
				alert('not exported!');
			}
		} else if (store[this.storeKey]) {
			const data = store[this.storeKey];
			const pdf = data.pdf;
			if (pdf) {
				// const exportString = zip.name + " / " + zip.orderName + " / " + unixTimeToDateFormat(zip.updateDate);
				const text = div(
					this.stateId,
					['button', 'enable'],
					{
						on: {
							click: this.click(),
						},
					},
					'download PDF!'
				);
				this.prePatch('#' + this.stateId, text);
				this.isExported = true;
			} else {
				const text = div(this.stateId, ['button', 'disable'], 'no export PDF');
				this.prePatch('#' + this.stateId, text);
				this.isExported = false;
			}
		} else {
		}
	}
	click() {
		return (event) => {
			if (this.isExported) {
				const action = ExportActionCreator.createDownloadPdfAction(); //createDownloadPdfAction
				this.dispatch(action);
			}
			event.stopPropagation();
			return false;
		};
	}
}
