import {ProgressBar} from "../view/parts/progressBar";
export class FileUploader {
  constructor(fileProcessor) {
    this.fileProcessor = fileProcessor;
    this.name = "FileUploader";
  }
  handleFileSelect() {
    return (event)=>{
      event.stopPropagation(); // Stops some browsers from redirecting.
      event.preventDefault();
      const files = event.target.files; // FileList object
      this.handleFiles(files);
    }
  }

  handleDrop(){
    return (event)=>{
      event.stopPropagation(); // Stops some browsers from redirecting.
      event.preventDefault();
      const files = event.dataTransfer.files;
      this.handleFiles(files);
    }
  }
  handleFiles(files){
    this.fileProcessor.processFiles(files);
  }
  async areadParFile(file){
    return await areadParFile(file);
  }
}
