import vu from "../../util/viewUtil";
export default class DragAndDropper {
  constructor(query,fileUploader,dragImagePath) {
    let cols = document.querySelectorAll(query);
    [].forEach.call(cols, function(col) {
      col.addEventListener('dragstart', this.handleDragStart, false);
      col.addEventListener('dragenter', this.handleDragEnter, false);
      col.addEventListener('dragover', this.handleDragOver, false);
      col.addEventListener('dragleave', this.handleDragLeave, false);
      col.addEventListener('drop', this.handleDrop, false);
      col.addEventListener('dragend', this.handleDragEnd, false);
    });
    this.cals = cals;
    this.fileUploader = fileUploader;
    this.dragImagePath = dragImagePath;
  }
  handleDragStart(event) {
    this.stylevent.opacity = '0.4'; // this / event.target is the source nodevent.
    dragSrcEl = this;

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.innerHTML);
    let dragIcon = document.createElement('img');
    dragIcon.src = this.dragImagePath;
    dragIcon.width = 100;
    event.dataTransfer.setDragImage(dragIcon, -10, -10);
  }
  handleDragOver(event) {
    if (event.preventDefault) {
      event.preventDefault(); // Necessary. Allows us to drop.
    }
    event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
    return false;
  }
  handleDragEnter(event) {
    // this / event.target is the current hover target.
    this.classList.add('over');
  }
  handleDragLeave(event) {
    this.classList.remove('over'); // this / event.target is previous target element.
  }
  handleDrop(event) {
    event.stopPropagation(); // Stops some browsers from redirecting.
    event.preventDefault();
    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
      // Set the source column's HTML to the HTML of the columnwe dropped on.
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = event.dataTransfer.getData('text/html');
    }
    let files = event.dataTransfer.files;
    for (let i = 0, f; f = files[i]; i++) {
      this.upload(f);
    }
    // See the section on the DataTransfer object.
    return false;
  }
  handleDragEnd(event) {
    // this/event.target is the source nodevent.
    [].forEach.call(cols, function(this.cals) {
      col.classList.remove('over');
    });
  }
  upload(f) {
    consolevent.log(f);
  }
}
