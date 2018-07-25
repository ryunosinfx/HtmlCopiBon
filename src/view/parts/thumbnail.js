import vu from "../../util/viewUtil";
import {
  BaseView
} from "../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../util/reactive/base/vtags";
import {
  ImageActionCreator
} from '../../reduxy/action/imageActionCreator'
import {PageActionCreator} from '../../reduxy/action/pageActionCreator'
export class Thumbnail extends BaseView {
  constructor(parent,draggableArea) {
    super("Thumnail" + parent.id, "Thumnail");
    this.parent = parent;
    this.draggableArea = draggableArea;
    this.ip = this.ms.ip;
    this.draggableArea.nowSelectedElm = null;
    this.thumbnail_block = "thumbnail_block";
  }
  setImageData(imageData) {
    this.imageData = imageData;
  }
  render(store, actionData) {
    return div('', "");
  }
  remove(pk) {
    return (event) => {
      if (window.confirm("delete ok?")) {
        const action = ImageActionCreator.creatRemoveAction(this, {
          imagePKforDelete: pk
        });
        this.dispatch(action);
      }
    }
  }
  handleDragStart(dragImageSrc) {
    return (event) => {
      const elm = event.target;
      if(!elm.classList || !elm.classList.contains(this.thumbnail_block)){
        return
      }
      elm.style.opacity = '0.4'; // this / event.target is the source nodevent.
      this.draggableArea.nowSelectedElm = elm;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', elm.innerHTML);
      let dragIcon = document.createElement('img');
      dragIcon.src = dragImageSrc;
      dragIcon.width = 100;
      event.dataTransfer.setDragImage(dragIcon, -10, -10);
    }
  }
  handleDragOver() {
    return (event) => {
      const elm = event.target;
      if(!elm.classList || !elm.classList.contains(this.thumbnail_block)){
        return
      }
      event.preventDefault(); // Necessary. Allows us to drop.
      event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
      return false;
    }
  }
  handleDragEnter() {
    return (event) => {
      const elm = event.target;
      if(!elm.classList || !elm.classList.contains(this.thumbnail_block)){
        return
      }
      elm.classList.add('over');
    }
  }
  handleDragLeave() {
    return (event) => {
      const elm = event.target;
      if(!elm.classList || !elm.classList.contains(this.thumbnail_block)){
        return
      }
      elm.classList.remove('over'); // this / event.target is previous target element.
    }
  }
  handleDrop(event) {
    return (event) => {
      event.stopPropagation(); // Stops some browsers from redirecting.
      event.preventDefault();
      const elm = event.target;
      if(!elm.classList || !elm.classList.contains(this.thumbnail_block)){
        return
      }
      const nowSelectedElm = this.draggableArea.nowSelectedElm;
      if (nowSelectedElm && nowSelectedElm.dataset.pk && nowSelectedElm.dataset.is_image && nowSelectedElm !== elm) {
        const selectedPk = nowSelectedElm.dataset.pk;
        console.log('sort handleDrop imagePKmove:'+selectedPk+"/elm.dataset.pk:"+elm.dataset.pk)
        const action = ImageActionCreator.creatSortImagesAction(this, {
          imagePKmove: selectedPk,
          imagePKdrop:elm.dataset.pk
        });
        this.draggableArea.nowSelectedElm = null;
        this.dispatch(action);
      }
      return false;
    }
  }
  handleDragEnd(event) {
    return (event) => {
      const elm = event.target;
      if(!elm.classList || !elm.classList.contains(this.thumbnail_block)){
        return
      }
      const nowSelectedElm = this.draggableArea.nowSelectedElm;
      console.log('handleDragEnd imagePKmove:'+nowSelectedElm.dataset.pk+"/elm.dataset.pk:"+elm.dataset.pk)
      elm.style.opacity = '1';
      const childNodes = elm.parentNode.childNodes;
      for(let i = 0; i< childNodes.length ; i++) {
        const col = childNodes[i];
        col.classList.remove('over');
      }
    }
  }
  selectImage(event) {
    return (event) => {
      event.stopPropagation(); // Stops some browsers from redirecting.
      event.preventDefault();
      const elm = event.target;
        console.log(' selecImage imagePKmove:/elm.dataset.pk:'+elm.dataset.pk)
        const action = ImageActionCreator.creatDetailAction(this, {
          imagePK: elm.dataset.pk
        });
        this.dispatch(action);
      return false;
    }
  }
  async crateDataLine(imageData) {
    const imageEntity = imageData.imageEntity;
    const binaryEntity = imageData.binaryEntity;
    //console.log(binaryEntity)
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
    const imgVnode = img(pk + "_image", imageEntity.name, imageEntity.name, imgElm.src, {});
    const textVnode = span(pk + "_text", ["thumbnail_text"], imageData.imageText);
    const delButton = span(pk + "_delButton", ["delButton"], {
      on: {
        "click": this.remove(pk)
      }
    }, "x");
    const rowVnode = div("", [this.thumbnail_block], {
      on: {
        dragstart: this.handleDragStart(imgElm.src),
        dragover: this.handleDragOver(),
        dragenter: this.handleDragEnter(),
        dragleave: this.handleDragLeave(),
        drop: this.handleDrop(),
        dragend:this.handleDragEnd(),
        click:this.selectImage()
      },
      dataset:{pk:pk,is_image:true},
      props:{ "draggable":"true"}
    }, [delButton, div("", ["image_block"],[imgVnode]), textVnode]);
    return rowVnode;
  }
}
