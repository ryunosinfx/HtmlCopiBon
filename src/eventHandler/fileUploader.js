import pb from "../view/parts/progressBar";
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
    this.reader = new FileReader();
    this.progress.init();

    this.reader.onerror = (event)=>{this.errorHandler(event)};
    this.reader.onprogress = (event)=>{this.updateProgress(event)};
    this.reader.onabort = (e) => {
      alert('File read cancelled');
    };

    this.reader.onloadstart = (event)=>{this.onLoadStart(event)};
    this.reader.onload = (event)=>{this.onload(event)};
    this.fileProcessor.showFiles(files);
    this.reader.readAsBinaryString(files[0]);
  }
  abortRead() {
    if (this.reader) {
      this.reader.abort();
    }
  }
  errorHandler(event) {
    switch (event.target.error.code) {
      case event.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case event.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case event.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    };
  }

  updateProgress(event) {
    const percentLoaded = Math.round((event.loaded / event.total) * 100);
    if (percentLoaded < 100) {
      this.progress.progress(percentLoaded);
    }
  }
  onload(event) {
    this.progress.compliet();
    
    if (this.fileProcessor) {
      this.fileProcessor.process();
    } else {
      alert("done!");
    }
  }
  onLoadStart() {
    this.progress.start();
  }
}
