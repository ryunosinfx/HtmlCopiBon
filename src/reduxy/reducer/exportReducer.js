import { ExportActionCreator } from '../action/exportActionCreator.js';
import { MainService } from '../../service/mainService.js';
import { BaseReducer } from '../../util/reactive/baseReducer.js';
import { ExportImageProcessor } from '../processor/exportImageProcessor.js';
import { ExportUtilProcessor } from '../processor/exportUtilProcessor.js';
import { PageProcessor } from '../processor/pageProcessor.js';
let exportReducer = null;
export class ExportReducer extends BaseReducer {
	constructor() {
		super();
		this.ms = MainService.getInstance();
		this.im = this.ms.im;
		this.bm = this.ms.bm;
		this.iom = this.ms.iom;
		this.tm = this.ms.tm;
		this.exportExecuteAction = ExportActionCreator.createExecuteAction();
		this.exportExecuteAllAction = ExportActionCreator.creatExecuteAllAction();
		this.exportRemoveAction = ExportActionCreator.creatRemoveAction();
		this.exportsLoadAction = ExportActionCreator.creatLoadAction();
		this.exportDownloadAction = ExportActionCreator.createDownloadAction();
		this.exportExecutePdfAction = ExportActionCreator.createExecutePdfAction();
		this.exportDownloadPdfAction = ExportActionCreator.createDownloadPdfAction();
		this.createDownloadImgAction = ExportActionCreator.createDownloadImgAction();
		this.createDownloadFullBKAction = ExportActionCreator.createDownloadFullBKAction();
		this.selectOrderAction = ExportActionCreator.createSelectOrderAction();
		this.atatch(this.exportExecuteAction);
		this.atatch(this.exportExecuteAllAction);
		this.atatch(this.exportRemoveAction);
		this.atatch(this.exportsLoadAction);
		this.atatch(this.exportDownloadAction);
		this.atatch(this.exportExecutePdfAction);
		this.atatch(this.exportDownloadPdfAction);
		this.atatch(this.createDownloadImgAction);
		this.atatch(this.createDownloadFullBKAction);
		this.atatch(this.selectOrderAction);

		this.pp = new PageProcessor();
		this.eip = new ExportImageProcessor(this.pp);
		this.eup = new ExportUtilProcessor(this.pp);
		this.storeKey = ExportActionCreator.getStoreKey();
		this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
		this.storeZipDLKey = ExportActionCreator.getStoreZipDLKey();
		this.storeRemoveResultKey = ExportActionCreator.getStoreRemoveResultKey();
		this.storeExportResultKey = ExportActionCreator.getStoreExportResultKey();
		this.storeUploadedImgZipDLKey = ExportActionCreator.getStoreUploadedImgZipDLKey();
		this.storeFullBackupZipDLKey = ExportActionCreator.getStoreFullBackupZipDLKey();
		this.storeSelectedOrderKey = ExportActionCreator.getStoreSelectedOrderKey();
		this.addInitializeKey(this.storeKey);
		this.addInitializeKey(this.storePdfDLKey);
		this.addInitializeKey(this.storeZipDLKey);
		this.addInitializeKey(this.storeRemoveResultKey);
		this.addInitializeKey(this.storeExportResultKey);
		this.addInitializeKey(this.storeUploadedImgZipDLKey);
		this.addInitializeKey(this.storeFullBackupZipDLKey);
		this.addInitializeKey(this.storeSelectedOrderKey);
	}
	static register() {
		if (!exportReducer) {
			exportReducer = new ExportReducer();
		}
	}
	async reduce(store, action) {
		if (this.exportExecuteAction.type === action.type) {
			const loadPks = await this.exportExecute(action.data.exportOrders);
			store[this.storeKey] = loadPks;
			store[this.storeExportResultKey] = loadPks;
		} else if (this.exportExecuteAllAction.type === action.type) {
			store[this.storeExportResultKey] = await this.exportExecute(action.data.exportOrders);
			store[this.storeExportResultKey] = await this.exportPdfExecute(action.data.exportOrders);
		} else if (this.exportRemoveAction.type === action.type) {
			const loadPks = await this.remove(action.data.exportPk);
			store[this.storeRemoveResultKey] = loadPks;
		} else if (this.exportsLoadAction.type === action.type) {
			store[this.storeKey] = await this.load();
		} else if (this.exportDownloadAction.type === action.type) {
			store[this.storeZipDLKey] = await this.loadZip(action.data.exportPk);
		} else if (this.exportExecutePdfAction.type === action.type) {
			const loadPks = await this.exportPdfExecute(action.data.exportOrders);
			store[this.storeKey] = loadPks;
			store[this.storeExportResultKey] = loadPks;
		} else if (this.exportDownloadPdfAction.type === action.type) {
			store[this.storePdfDLKey] = await this.loadPdf(action.data.exportPk);
		} else if (this.createDownloadImgAction.type === action.type) {
			store[this.storeUploadedImgZipDLKey] = await this.loadUploadedImageZip();
		} else if (this.createDownloadFullBKAction.type === action.type) {
			store[this.storeFullBackupZipDLKey] = await this.loadFullBackupZip(action.data.exportPk);
		} else if (this.selectOrderAction.type === action.type) {
			if (action.data.selectOrder && action.data.selectOptions) {
				const newData = {
					selectOptions: action.data.selectOptions,
					selectOrder: action.data.selectOrder,
				};
				store[this.storeSelectedOrderKey] = newData;
			}
		}
		return store;
	}
	async exportExecute(exportOrders) {
		const exportPks = await this.eip.exportZipExecute(exportOrders);
		return await this.eup.getZipPdfPair(exportPks);
	}
	async exportPdfExecute(exportOrders) {
		const exportPks = await this.eip.exportPdfExecute(exportOrders);
		return await this.eup.getZipPdfPair(exportPks);
	}
	// whh save single data ? the data is too Big for indexeddb !
	async loadZip(exportPk) {
		return await this.eup.loadZip(exportPk);
	}
	// whh save single data ? the data is too Big for indexeddb !
	async loadPdf(exportPk) {
		return await this.eup.loadPdf(exportPk);
	}
	// whh save single data ? the data is too Big for indexeddb !
	async loadUploadedImageZip(exportPk) {
		return await this.eup.loadUploadedImagesZip(exportPk);
	}
	// whh save single data ? the data is too Big for indexeddb !
	async loadFullBackupZip(exportPk) {
		return await this.eup.loadFullBackupZip(exportPk);
	}
	async remove(exportPk) {
		//
		await this.eup.remove(exportPk);
		return await this.eup.load();
	}
	async load() {
		return await this.eup.load();
	}
}
