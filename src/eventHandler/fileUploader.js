import {ProgressBar} from "../view/parts/progressBar";
import {BaseEventHandler} from "./baseEventHandler";
import {ImageActionCreator} from '../reduxy/action/imageActionCreator'
import {ImageViewReducer} from '../reduxy/reducer/imageViewReducer'
export class FileUploader extends BaseEventHandler {
  constructor(fileProcessor) {
    super();
    this.fileProcessor = fileProcessor;
    this.name = "FileUploader";
    ImageViewReducer.register()
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
    const actin = ImageActionCreator.creatAddAction(this.fileProcessor,{files:files});
    this.fileProcessor.dispathc(actin);
    //this.fileProcessor.processFiles(files);
  }
  async areadParFile(file){
    return await areadParFile(file);
  }
}
