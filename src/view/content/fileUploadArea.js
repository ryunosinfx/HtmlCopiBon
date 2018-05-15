import vu from "../../util/viewUtil";
import BaseView from "../baseView";
import fu from "../../eventHandler/fileUploader";
const text = "ここにファイルをアップロードしてください。";
export default class FileUploadArea extends BaseView {
  constructor(anker) {
    super(anker);
  }
  render() {
    const elm = vu.create("fuaPArent", "frame");
    this.fileInput = vu.createFile("FileUploadFile", "FileUploadFile", text);
    const area = vu.createLabel("FileUploadArea", "FileUploadArea", text,"FileUploadFile");
    vu.append(elm, area);
    vu.append(elm, this.fileInput);
    return elm;
  }
  addEventListeners(fp) {
    this.fu = new fu(fp);
    vu.on(this.fileInput, 'change', (e) => {
      this.fu.handleFileSelect(e)
    });
    vu.on(this.elm, 'dragover', (e) => {
      this.fu.handleDrop(e)
    });
    vu.on(this.elm, 'drop', (e) => {
      this.fu.handleDrop(e)
    });
    vu.on(this.elm, 'click', (e) => {
      this.fu.test(e);
      vu.emit(this.fileInput, 'click',false,false);
    });
  }
}
