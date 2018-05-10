import vu from "../../util/viewUtil";
export default class FileUploadArea {
  constructor(){
    this.text="ここにファイルをアップロードしてください。";
  }
  render() {
    const elm = vu.create("FileUploadArea", "FileUploadArea",this.text);
    return elm;
  }
}
