import {
  ExportActionCreator
} from '../action/exportActionCreator'
import {
  MainService
} from "../../service/mainService"
import {
  BaseReducer
} from '../../util/reactive/baseReducer'
import {ExportImageProcesser} from '../processor/exportImageProcesser'
import {PageProcessor} from '../processor/pageProcessor'
import {ImageActionCreator} from '../action/imageActionCreator'
let exportReducer = null;
export class ExportReducer extends BaseReducer {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.im = this.ms.im;
    this.exportExecuteAction = ExportActionCreator.createExecuteAction();
    this.exportRemoveAction = ExportActionCreator.creatRemoveAction();
    this.exportsLoadAction = ExportActionCreator.creatLoadAction();
    this.exportDownloadAction = ExportActionCreator.createDownloadAction();
    this.exportExecutePdfAction = ExportActionCreator.createExecutePdfAction();
    this.exportDownloadPdfAction = ExportActionCreator.createDownloadPdfAction();
    this.atatch(this.exportExecuteAction);
    this.atatch(this.exportRemoveAction);
    this.atatch(this.exportsLoadAction);
    this.atatch(this.exportDownloadAction);
    this.atatch(this.exportExecutePdfAction);
    this.atatch(this.exportDownloadPdfAction);

    this.pp = new PageProcessor();
    this.eip = new ExportImageProcesser(this.pp );
    this.storeKey = ExportActionCreator.getStoreKey();
  }
  static register() {
    if (!exportReducer) {
      exportReducer = new ExportReducer();
    }
  }
  async reduce(store, action) {
    if (this.exportExecuteAction.type === action.type) {
      store[this.storeKey] = await this.exportExecute(action.data.exportOrders);
    } else if (this.exportRemoveAction.type === action.type) {
      store[this.storeKey] = await this.remove(action.data.exportPk);
    } else if (this.exportsLoadAction.type === action.type) {
      store[this.storeKey] = await this.load();
    } else if (this.exportDownloadAction.type === action.type) {
      store[this.storeKey] = await this.loadZip(action.data.exportPk);
    } else if (this.exportExecutePdfAction.type === action.type) {
      store[this.storeKey] = await this.exportPdfExecute(action.data.exportOrders);
    } else if (this.exportDownloadPdfAction.type === action.type) {
      store[this.storeKey] = await this.loadPdf(action.data.exportPk);
    }
    return store;
  }
  async exportExecute(exportOrders){
    return await this.eip.exportExecute(exportOrders);
  }
  async exportPdfExecute(exportOrders){
    return await this.eip.exportPdfExecute(exportOrders);
  }
  async loadZip(exportPk=0){
    return await this.eip.loadZip(exportPk);
  }
  async loadPdf(exportPk=0){
    return await this.eip.loadPdf(exportPk);
  }
  async remove(exportPk){
    //
    await this.eip.remove(exportPk);
    return await this.eip.load();
  }
  async load(){
    //
    return await this.eip.load();
  }
}
