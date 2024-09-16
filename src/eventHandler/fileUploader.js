import { BaseEventHandler } from './baseEventHandler.js';
import { ImageActionCreator } from '../reduxy/action/imageActionCreator.js';
import { ImageViewReducer } from '../reduxy/reducer/imageViewReducer.js';
export class FileUploader extends BaseEventHandler {
	constructor(fileProcessor) {
		super();
		// this.fileProcessor = fileProcessor;
		this.name = 'FileUploader';
		ImageViewReducer.register();
	}
	handleFileSelect(view) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			this.handleFiles(view, event.target.files); // FileList object
		};
	}

	handleDrop(view) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			this.handleFiles(view, event.dataTransfer.files);
		};
	}
	handleFiles(view, files) {
		const actin = ImageActionCreator.creatAddAction(view, { files });
		view.dispatch(actin);
		//this.fileProcessor.processFiles(files);
	}
	async areadParFile(file) {
		return await areadParFile(file);
	}
}
