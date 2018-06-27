import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  file
} from "../../util/reactive/base/vtags";
import {FileUploader} from "../../eventHandler/fileUploader";
const text = "ここにファイルをアップロードしてください。";
export class FileUploadArea extends BaseView {
  constructor() {
    super("fuaPArent", "FileUploadArea",true);
    this.fu = new FileUploader();
  }
  render() {
    this.FileUploadFile = file("FileUploadFile", ["FileUploadFile"],{on:{
      'change':this.fu.handleFileSelect(this)
    }});
    this.fileUploadArea = div("FileUploadArea", ["FileUploadAreaA"],text);

    return div(this.id, ["FileUploadArea"], {
      on: {
        'dragover': this.fu.handleDrop(this),
        'drop': this.fu.handleDrop(this),
        'click': (e) => {
          const fileInput = this.getElementById("FileUploadFile");
          fileInput.elm.click();
        }
      }
    }, [this.fileUploadArea, this.FileUploadFile]);
  }
  onAfterAttach(store, data) {
    //alert('FileUploadArea onAfterAttach')
    //this.addEventListeners();
  }
}
