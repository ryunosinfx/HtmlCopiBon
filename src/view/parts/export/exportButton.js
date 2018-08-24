import {
  BaseView
} from "../../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../../util/reactive/base/vtags"; //
import {
  ExportActionCreator
} from '../../../reduxy/action/exportActionCreator'
import {
  ExportReducer
} from '../../../reduxy/reducer/exportReducer'
import {
  ExportAllButton
} from './exportAllButton'
import {
  ExportImgZipButton
} from "./exportImgZipButton";
import {
  ExportPdfButton
} from './exportPdfButton'
import {
  DownloadLastExportZipButton
} from './downloadLastExportZipButton'
import {
  DownloadLastExportPdfButton
} from './downloadLastExportPdfButton'
import {
  DeleteExportOneButton
} from './deleteExportOneButton'
export class ExportButton extends BaseView {
  constructor() {
    super("ExportButton", "ExportButtonFrame");
    this.storeKey = ExportActionCreator.getStoreKey();
    this.exportAllButton = new ExportAllButton();
    this.exportImgZipButton = new ExportImgZipButton();
    this.exportPdfButton = new ExportPdfButton();
    this.downloadLastExportZipButton = new DownloadLastExportZipButton();
    this.downloadLastExportPdfButton = new DownloadLastExportPdfButton();
    this.deleteExportOneButton = new DeleteExportOneButton();
  }
  onAfterAttach(store, data) {
    this.exportAllButton.attach(this);
    this.exportImgZipButton.attach(this);
    this.exportPdfButton.attach(this);
    this.downloadLastExportZipButton.attach(this);
    this.downloadLastExportPdfButton.attach(this);
    this.deleteExportOneButton.attach(this);
    ExportReducer.register();
    const action = ExportActionCreator.creatLoadAction(this);
    this.dispatch(action);
  }

  async onViewShow(store, actionData) {
    if (store[this.storeKey]) {
      //alert("OK");
    }
  }

  render(store, actionData) {
    return div("", ["ExportButtons"], [
      div(this.exportAllButton.id),
      div(this.exportImgZipButton.id),
      div(this.exportPdfButton.id),
      div(this.downloadLastExportZipButton.id),
      div(this.downloadLastExportPdfButton.id),
      div(this.deleteExportOneButton.id)
    ]);
  }
}
