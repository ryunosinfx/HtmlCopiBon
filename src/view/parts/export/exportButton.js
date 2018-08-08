import {BaseView} from "../../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../../util/reactive/base/vtags";//
import {ExportActionCreator} from '../../../reduxy/action/exportActionCreator'
import {ExportReducer} from '../../../reduxy/reducer/exportReducer'
import {ExportAllButton} from './exportAllButton'
import {ExportImgZipButton} from "./exportImgZipButton";
import {ExportPdfButton} from './exportPdfButton'
import {DownloadLastExportOneButton} from './downloadLastExportOneButton'
import {DeleteExportOneButton} from './deleteExportOneButton'
export class ExportButton extends BaseView {
  constructor() {
    super("ExportButton", "ExportButtonFrame");
    this.storeKey = ExportActionCreator.getStoreKey();
    this.exportAllButton = new ExportAllButton();
    this.exportImgZipButton = new ExportImgZipButton();
    this.exportPdfButton = new ExportPdfButton();
    this.downloadLastExportOneButton = new DownloadLastExportOneButton();
    this.deleteExportOneButton = new DeleteExportOneButton();
  }
  onAfterAttach(store, data) {
    this.exportAllButton.attach(this);
    this.exportImgZipButton.attach(this);
    this.exportPdfButton.attach(this);
    this.downloadLastExportOneButton.attach(this);
    this.deleteExportOneButton.attach(this);
    ExportReducer.register();
  }

  async onViewShow(store, actionData) {
    if (store[this.storeKey]) {
      alert("OK");
    }
  }

  render(store, actionData) {
    return div("", ["ExportButtons"], [
      div(this.exportAllButton.id),
      div(this.exportImgZipButton.id),
      div(this.exportPdfButton.id),
      div(this.downloadLastExportOneButton.id),
      div(this.deleteExportOneButton.id)
    ]);
  }
}
