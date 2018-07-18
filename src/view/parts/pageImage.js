import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class PageImage  extends BaseView {
  constructor(listing) {
    super("PageImage"+listing, "PageImage");
  }
  render() {
    this.button = div(this.id+"child", "PageImageA", this.id);
    return div( [this.button]);
  }
  setImageData(imageData) {
    this.imageData = imageData;
  }
  renderA(store, actionData) {
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
      this.dragElm = elm;
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
      if (this.dragElm !== elm) {
        console.log('sort handleDrop imagePKmove:'+this.dragElm.dataset.pk+"/elm.dataset.pk:"+elm.dataset.pk)
        const action = ImageActionCreator.creatSortImagesAction(this, {
          imagePKmove: this.dragElm.dataset.pk,
          imagePKdrop:elm.dataset.pk
        });
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
        console.log('sort selecImage imagePKmove:/elm.dataset.pk:'+elm.dataset.pk)
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
      dataset:{pk:pk},
      props:{ "draggable":"true",'data-pk':pk}
    }, [delButton, div("", ["image_block"],[imgVnode]), textVnode]);
    return rowVnode;
  }
}
