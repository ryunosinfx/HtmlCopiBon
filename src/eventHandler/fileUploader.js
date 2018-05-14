import pb from "../view/parts/progressBar";
import fue from "./fileUploadExecuter";
export default class FileUploader {
  constructor(fileProcessor, indigator) {
    this.fileProcessor = fileProcessor;
    this.progress = indigator;
    this.name = "FileUploader";
  }
  test(){
    alert(this.name );
  }
  handleFileSelect(event) {
    event.stopPropagation(); // Stops some browsers from redirecting.
    event.preventDefault();
    let files = event.target.files; // FileList object
    this.handleFiles(files);
  }

  handleDrop(event){
    event.stopPropagation(); // Stops some browsers from redirecting.
    event.preventDefault();

    let files = event.dataTransfer.files;
    this.handleFiles(files);
  }
  handleFiles(files){
    let fueInst = new fue(this.fileProcessor, this.progress);
    this.fileProcessor.showFiles(fueInst,files);
  }
  async areadParFile(file){
    return await areadParFile(file);
  }
}
