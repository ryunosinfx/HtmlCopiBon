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
  handleDragStart(e) {
    this.style.opacity = '0.4'; // this / e.target is the source node.
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    let dragIcon = document.createElement('img');
    dragIcon.src = this.dragImagePath;
    dragIcon.width = 100;
    e.dataTransfer.setDragImage(dragIcon, -10, -10);
  }
  handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
    return false;
  }
  handleDragEnter(e) {
    // this / e.target is the current hover target.
    this.classList.add('over');
  }
  handleDragLeave(e) {
    this.classList.remove('over'); // this / e.target is previous target element.
  }
  handleDrop(e) {
    e.stopPropagation(); // Stops some browsers from redirecting.
    e.preventDefault();
    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
      // Set the source column's HTML to the HTML of the columnwe dropped on.
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
    let files = e.dataTransfer.files;
    for (let i = 0, f; f = files[i]; i++) {
      this.upload(f);
    }
    // See the section on the DataTransfer object.
    return false;
  }
  handleDragEnd(e) {
    // this/e.target is the source node.
    [].forEach.call(cols, function(this.cals) {
      col.classList.remove('over');
    });
  }
  upload(f) {
    console.log(f);
  }
}
