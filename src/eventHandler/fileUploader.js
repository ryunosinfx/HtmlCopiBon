import pb from "../view/parts/progressBar";
export default class FileUploader {
  constructor(fileProcessor, indigator) {
    this.fileProcessor = fileProcessor;
    this.progress = indigator;
  }
  handleFileSelect(event) {
    let files = event.target.files; // FileList object
    this.reader = new FileReader();
    this.progress.init();

    this.reader.onerror = this.errorHandler;
    this.reader.onprogress = this.updateProgress;
    this.reader.onabort = (e) => {
      alert('File read cancelled');
    };

    this.reader.onloadstart = this.onLoadStart;
    this.reader.onload = this.onload;
    this.fileProcessor.showFiles(files);
    this.reader.readAsBinaryString(evt.target.files[0]);
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
    setTimeout("document.getElementById('progress_bar').className='';", 2000);
    if (this.fileProcessor) {
      this.fileProcessor.process();
    } else {
      alert("done!");
    }
  }
  onLoadStart() {
    document.getElementById('progress_bar').className = 'loading';
  }
}
