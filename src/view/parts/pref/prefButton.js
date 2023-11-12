import { BaseView } from '../../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../../util/reactive/base/vtags.js'; //
import { ExportActionCreator } from '../../../reduxy/action/exportActionCreator.js';
import { ExportReducer } from '../../../reduxy/reducer/exportReducer.js';
import { ExportAllButton } from './exportAllButton.js';
import { ExportImgZipButton } from './exportImgZipButton.js';
import { ExportPdfButton } from './exportPdfButton.js';
import { DownloadLastExportZipButton } from './downloadLastExportZipButton.js';
import { DownloadLastExportPdfButton } from './downloadLastExportPdfButton.js';
import { DownloadUploadedImgZipButton } from './downloadUploadedImgZipButton.js';
import { DownloadFullBackupZipButton } from './downloadFullBackupZipButton.js';
import { DeleteExportOneButton } from './deleteExportOneButton.js';
export class PrefButton extends BaseView {
	constructor() {
		super('ExportButton', 'ExportButtonFrame');
		this.storeKey = ExportActionCreator.getStoreKey();
		this.exportAllButton = new ExportAllButton();
		this.exportImgZipButton = new ExportImgZipButton();
		this.exportPdfButton = new ExportPdfButton();
		this.downloadLastExportZipButton = new DownloadLastExportZipButton();
		this.downloadLastExportPdfButton = new DownloadLastExportPdfButton();
		this.downloadUploadedImgZipButton = new DownloadUploadedImgZipButton();
		this.downloadFullBackupZipButton = new DownloadFullBackupZipButton();
		this.deleteExportOneButton = new DeleteExportOneButton();
	}
	async onAfterAttach(store, data) {
		await this.exportAllButton.attach(this);
		await this.exportImgZipButton.attach(this);
		await this.exportPdfButton.attach(this);
		await this.downloadLastExportZipButton.attach(this);
		await this.downloadLastExportPdfButton.attach(this);
		await this.downloadUploadedImgZipButton.attach(this);
		await this.downloadFullBackupZipButton.attach(this);
		await this.deleteExportOneButton.attach(this);
		ExportReducer.register();
		const action = ExportActionCreator.creatLoadAction(this);
		await this.dispatch(action);
	}

	async onViewShow(store, actionData) {
		if (store[this.storeKey]) {
			//alert("OK");
		}
	}

	render(store, actionData) {
		return div(
			'',
			['ExportButtons'],
			[
				div(this.exportAllButton.id),
				div(this.exportImgZipButton.id),
				div(this.exportPdfButton.id),
				div(this.downloadLastExportZipButton.id),
				div(this.downloadLastExportPdfButton.id),
				div(this.deleteExportOneButton.id),
				div(this.downloadUploadedImgZipButton.id),
				div(this.downloadFullBackupZipButton.id),
			]
		);
	}
}
