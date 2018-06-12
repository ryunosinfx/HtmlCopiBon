import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
import {FileUploader} from "../../eventHandler/fileUploader";
const text = "ここにファイルをアップロードしてください。";
export class FileUploadArea extends BaseView {
  constructor(parent) {
    super(parent,"fuaPArent", "frame");
  }
  render() {
    this.fileInput = vu.createFile("FileUploadFile", "FileUploadFile", text);
    const area = vu.createLabel("FileUploadArea", "FileUploadArea", text,"FileUploadFile");
    vu.append(this.elm, area);
    vu.append(this.elm, this.fileInput);
    return this.elm;
  }
  addEventListeners(fp) {
    this.fu = new FileUploader(fp);
    vu.on(this.fileInput, 'change', this.fu.handleFileSelect());
    vu.on(this.elm, 'dragover', this.fu.handleDrop());
    vu.on(this.elm, 'drop', this.fu.handleDrop());
    vu.on(this.elm, 'click', (e) => {
      vu.emit(this.fileInput, 'click',false,false);
    });
  }
}
