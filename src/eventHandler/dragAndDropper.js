import { BaseEventHandler } from './baseEventHandler.js';
export class DragAndDropper extends BaseEventHandler {
	constructor(query, fileUploader, dragImagePath) {
		super();
		let cols = document.querySelectorAll(query);
		[].forEach.call(cols, function (col) {
			col.addEventListener('dragstart', this.handleDragStart(), false);
			col.addEventListener('dragenter', this.handleDragEnter(), false);
			col.addEventListener('dragover', this.handleDragOver(), false);
			col.addEventListener('dragleave', this.handleDragLeave(), false);
			col.addEventListener('drop', this.handleDrop(), false);
			col.addEventListener('dragend', this.handleDragEnd(), false);
		});
		this.cals = cals;
		this.fileUploader = fileUploader;
		this.dragImagePath = dragImagePath;
	}
	handleDragStart() {
		return (event) => {
			this.stylevent.opacity = '0.4'; // this / event.target is the source nodevent.
			dragSrcEl = this;
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/html', this.innerHTML);
			let dragIcon = document.createElement('img');
			dragIcon.src = this.dragImagePath;
			dragIcon.width = 100;
			event.dataTransfer.setDragImage(dragIcon, -10, -10);
		};
	}
	handleDragOver() {
		return (event) => {
			if (event.preventDefault) {
				event.preventDefault(); // Necessary. Allows us to drop.
			}
			event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
			return false;
		};
	}
	handleDragEnter() {
		return (event) => {
			this.classList.add('over');
		};
	}
	handleDragLeave() {
		return (event) => {
			this.classList.remove('over'); // this / event.target is previous target element.
		};
	}
	handleDrop(event) {
		return (event) => {
			event.stopPropagation(); // Stops some browsers from redirecting.
			event.preventDefault();
			if (dragSrcEl !== this) {
				// Don't do anything if dropping the same column we're dragging.
				dragSrcEl.innerHTML = this.innerHTML; // Set the source column's HTML to the HTML of the columnwe dropped on.
				this.innerHTML = event.dataTransfer.getData('text/html');
			}
			let files = event.dataTransfer.files;
			for (let i = 0, f; (f = files[i]); i++) {
				this.upload(f);
			}
			return false;
		};
	}
	handleDragEnd(event) {
		return (event) => {
			[].forEach.call(cols, function () {
				col.classList.remove('over');
			});
		};
	}
	upload(f) {
		consolevent.log(f);
	}
}
