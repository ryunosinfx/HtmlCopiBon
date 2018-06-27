import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
import {ImageActionCreator} from '../../reduxy/action/imageActionCreator'
export class Thumbnail  extends BaseView {
  constructor(parent) {
    super("Thumnail"+parent.id, "Thumnail");
    this.parent = parent ;
    this.ip = this.ms.ip;
  }
  setImageData(imageData){
    this.imageData = imageData;
  }
  render(store, actionData) {
    return div('' ,"");
  }
  remove(pk) {
    return (event)=>{
      if (window.confirm("delete ok?")) {
        const action = ImageActionCreator.creatRemoveAction(this, {imagePKforDelete:pk});
        this.dispatch(action);
      }
    }
  }
  handleDragStart() {
    return (event)=>{
      this.stylevent.opacity = '0.4'; // this / event.target is the source nodevent.
      dragSrcEl = this;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', this.innerHTML);
      let dragIcon = document.createElement('img');
      dragIcon.src = this.dragImagePath;
      dragIcon.width = 100;
      event.dataTransfer.setDragImage(dragIcon, -10, -10);
    }
  }
  handleDragOver() {
    return (event)=>{
      if (event.preventDefault) {
        event.preventDefault(); // Necessary. Allows us to drop.
      }
      event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
      return false;
    }
  }
  handleDragEnter() {
    return (event)=>{
      this.classList.add('over');
    }
  }
  handleDragLeave() {
    return (event)=>{
      this.classList.remove('over'); // this / event.target is previous target element.
    }
  }
  handleDrop(event) {
    return (event)=>{
      event.stopPropagation(); // Stops some browsers from redirecting.
      event.preventDefault();
      if (dragSrcEl != this) {// Don't do anything if dropping the same column we're dragging.
        dragSrcEl.innerHTML = this.innerHTML;// Set the source column's HTML to the HTML of the columnwe dropped on.
        this.innerHTML = event.dataTransfer.getData('text/html');
      }
      return false;
    }
  }
  handleDragEnd(event) {
    return (event)=>{
      // [].forEach.call(cols, function(this.cals) {
      //   col.classList.remove('over');
      // });
    }
  }
  async crateDataLine(imageData) {
    const imageEntity = imageData.imageEntity;
    const binaryEntity = imageData.binaryEntity;
    console.log(binaryEntity)
    const data = {
      name: imageEntity.name,
      ab: binaryEntity._ab,
      type: imageEntity.type
    }
    const imgElm = await this.ip.createImageNodeByData(data).catch((e) => {
      console.log(e);
      throw e
    });
    const pk = imageEntity.getPk();
    const imgVnode = img(pk, imageEntity.name, imageEntity.name, imgElm.src, {});
    const textVnode = span(pk + "_", ["images"], imageData.imageText);
    const delButton = span(pk + "_delButton", ["delButton"], {on:{"click":this.remove(pk)}},"x");
    const dataLineVnode = div("", ["dataLine"], [delButton, imgVnode, textVnode]);
    const rowVnode = div("", ["row"],[dataLineVnode]);
    return rowVnode;
  }
}
