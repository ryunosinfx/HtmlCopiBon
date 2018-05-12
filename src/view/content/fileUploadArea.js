import vu from "../../util/viewUtil";
import BaseView from "../baseView";
import fu from "../../eventHandler/fileUploader";
import pb from "../parts/progressBar";
const text="ここにファイルをアップロードしてください。";
export default class FileUploadArea extends BaseView{
  constructor(anker){
    super(anker);
    this.pb = new pb(this.elm);
  }
  render() {
    const elm = vu.create("FileUploadArea", "FileUploadArea",text);
    return elm;
  }
  addEventListeners(fp){
    this.fu = new fu(fp,this.pb);
    this.elm.addEventListener('change', this.fu.handleFileSelect, false);
  }
}
