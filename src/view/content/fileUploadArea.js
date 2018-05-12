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
    const elm = vu.createFile("FileUploadArea", "FileUploadArea",text);
    return elm;
  }
  addEventListeners(fp){
    this.fu = new fu(fp,this.pb);
    vu.on(this.elm,'change',(e)=>{this.fu.handleFileSelect(e)});
    vu.on(this.elm,'drop',(e)=>{this.fu.handleDrop(e)});
    vu.on(this.elm,'click',(e)=>{this.fu.test(e)});
  }
}
