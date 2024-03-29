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
			const files = event.target.files; // FileList object
			this.handleFiles(view, files);
		};
	}

	handleDrop(view) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			const files = event.dataTransfer.files;
			this.handleFiles(view, files);
		};
	}
	handleFiles(view, files) {
		const actin = ImageActionCreator.creatAddAction(view, { files: files });
		view.dispatch(actin);
		//this.fileProcessor.processFiles(files);
	}
	async areadParFile(file) {
		return await areadParFile(file);
	}
}
