
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
} from "../../../util/reactive/base/vtags";
import {
  ExportActionCreator
} from '../../../reduxy/action/exportActionCreator'
import {FileDownloader} from "../../../util/fileDownloader";
export class DownloadLastExportPdfButton extends BaseView {
  constructor() {
    super("DownloadLastExportOneButton", "DownloadLastExportOneButton",true);
    this.storeKey = ExportActionCreator.getStoreKey();
    this.storePdfDLKey = ExportActionCreator.getStorePdfDLKey();
    this.storeZipDLKey = ExportActionCreator.getStoreZipDLKey();
    this.storeRemoveResultKey = ExportActionCreator.getStoreRemoveResultKey();
    this.storeExportResultKey = ExportActionCreator.getStoreExportResultKey();
  }

  render(store, actionData) {
    return div(this.id, [this.id + "Frame"],{
      on:{
        click:this.click()
      }
    }, [ div("", ["button"], "download PDF!")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {
      if (store[this.storePdfDLKey]) {
        const output = store[this.storePdfDLKey];
        if(output.ab){
          FileDownloader.download(output.name,output.ab,"application/pdf");
        }else{
          alert("not exported!");
        }
      }
  }
    click(){
      return (event)=>{
        const action= ExportActionCreator.createDownloadPdfAction();//createDownloadPdfAction
        this.dispatch(action);
        event.stopPropagation();
        return false;
      }
    }
}
