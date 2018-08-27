import {ExportActionCreator} from '../action/exportActionCreator'
import {MainService} from "../../service/mainService"
import {BaseReducer} from '../../util/reactive/baseReducer'
import {ExportImageProcesser} from '../processor/exportImageProcesser'
import {ExportUtilProcesser} from '../processor/exportUtilProcesser'
import {PageProcessor} from '../processor/pageProcessor'
import {ImageActionCreator} from '../action/imageActionCreator'
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
    this.selectOrderAction = createSelectOrderAction.createDownloadPdfAction();
    this.atatch(this.exportExecuteAction);
    this.atatch(this.exportExecuteAllAction);
    this.atatch(this.exportRemoveAction);
    this.atatch(this.exportsLoadAction);
    this.atatch(this.exportDownloadAction);
    this.atatch(this.exportExecutePdfAction);
    this.atatch(this.exportDownloadPdfAction);
    this.atatch(this.selectOrderAction);

    this.pp = new PageProcessor();
    this.eip = new ExportImageProcesser(this.pp);
    this.eup = new ExportUtilProcesser(this.pp);
    this.storeKey = ExportActionCreator.getStoreKey();
    this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
    this.storeZipDLKey = ExportActionCreator.getStoreZipDLKey();
    this.storeRemoveResultKey = ExportActionCreator.getStoreRemoveResultKey();
    this.storeExportResultKey = ExportActionCreator.getStoreExportResultKey();
    this.storeSelectedOrderKey = ExportActionCreator.getStoreSelectedOrderKey();
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
      store[this.storeExportResultKey] =loadPks;
      store[this.storeRemoveResultKey] =null;
    } else if (this.exportExecuteAllAction.type === action.type) {
      store[this.storeExportResultKey] = await this.exportExecute(action.data.exportOrders);
      store[this.storeExportResultKey] = await this.exportPdfExecute(action.data.exportOrders);
      store[this.storeRemoveResultKey] =null;
    } else if (this.exportRemoveAction.type === action.type) {
      const loadPks = await this.remove(action.data.exportPk);
      store[this.storeRemoveResultKey] = loadPks;
      store[this.storeKey] = loadPks;
    } else if (this.exportsLoadAction.type === action.type) {
      store[this.storeKey] = await this.load();
      store[this.storeExportResultKey] =null;
    } else if (this.exportDownloadAction.type === action.type) {
      store[this.storeZipDLKey] = await this.loadZip(action.data.exportPk);
      store[this.storeExportResultKey] =null;
    } else if (this.exportExecutePdfAction.type === action.type) {
      const loadPks = await this.exportPdfExecute(action.data.exportOrders);
      store[this.storeKey] = loadPks;
      store[this.storeExportResultKey] =loadPks;
      store[this.storeRemoveResultKey] =null;
    } else if (this.exportDownloadPdfAction.type === action.type) {
      store[this.storePdfDLKey] = await this.loadPdf(action.data.exportPk);
      store[this.storeExportResultKey] =null;
    } else if (this.selectOrderAction.type === action.type) {
      store[this.storeSelectedOrderKey] = await this.loadPdf(action.data.exportPk);
    }
    return store;
  }
  async exportExecute(exportOrders) {
    const exportPks = await this.eip.exportExecute(exportOrders);
    return await this.eup.getZipPdfPair(exportPks);
  }
  async exportPdfExecute(exportOrders) {
    return await this.eip.exportPdfExecute(exportOrders);
  }
  // whh save single data ? the data is too Big for indexeddb !
  async loadZip(exportPk) {
    return await this.eup.loadZip(exportPk);
  }
  // whh save single data ? the data is too Big for indexeddb !
  async loadPdf(exportPk) {
    return await this.eup.loadPdf(exportPk);
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
