import {MainService} from "./mainService";
import {ProgressActionCreator} from "../reduxy/action/progressActionCreator";
import {ActionDispatcher} from "../util/reactive/actionDispatcher";
export class FileUploadExecuter {
  constructor() {
    this.actionDispatcher = ActionDispatcher.createStandAlon();
    this.name = "FileUploader";
    this.ms = MainService.getInstance();
  }
  async readAsArrayBuffer(file) {
    return await this.read(file, "ArrayBuffer");
  }
  async readAsBinaryString(file) {
    return await this.read(file, "BinaryString");
  }
  async readAsDataURL(file) {
    return await this.read(file, "DataURL");
  }
  async readAsText(file) {
    return await this.read(file, "text");
  }
  read(file, type = "binaryString") {
    return new Promise((resolve, reject) => {
      this.reader = new FileReader();
      //this.progress.init();
      this.reader.onerror = (event) => {
        reject(this.errorHandler(event));
      };
      this.reader.onprogress = (event) => {
        this.updateProgress(event);
      };
      this.reader.onabort = (e) => {
        alert('File read cancelled');
      };

      this.reader.onloadstart = (event) => {
        this.onLoadStart(event)
      };
      this.reader.onload = (event) => {
        resolve(this.onload(event));
      };
      if (type === "ArrayBuffer") {
        this.reader.readAsArrayBuffer(file);
      } else if (type === "BinaryString") {
        this.reader.readAsBinaryString(file);
      } else if (type === "DataURL") {
        this.reader.readAsDataURL(file);
      } else {
        this.reader.readAsText(file);
      }
    })
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
      //this.progress.progress(percentLoaded);
      this.actionDispatcher(ProgressActionCreator.createAction(null,{progress:percentLoaded}));

    }
  }
  onload(event) {
    this.actionDispatcher(ProgressActionCreator.createAction());
    return this.reader.result;
  }
  onLoadStart() {
    this.actionDispatcher(ProgressActionCreator.createAction());
    //this.progress.start();
  }
}
