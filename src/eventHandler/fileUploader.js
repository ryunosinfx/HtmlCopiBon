import pb from "../view/parts/progressBar";
export default class FileUploader {
  constructor(fileProcessor) {
    this.fileProcessor = fileProcessor;
    this.name = "FileUploader";
  }
  test(){
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
    this.fileProcessor.processFiles(files);
  }
  async areadParFile(file){
    return await areadParFile(file);
  }
}
