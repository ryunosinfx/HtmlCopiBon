import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
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
import {PageActionCreator} from '../../reduxy/action/pageActionCreator'
import {ImageActionCreator} from '../../reduxy/action/imageActionCreator'
export class PageImage extends BaseView {
  constructor(parent, listing,draggableArea) {
    super("PageImage" + listing, "PageImage");
    this.parent = parent;
    this.draggableArea = draggableArea;
    this.listing = listing;
    this.thumbnail = null;
    this.thumbnail_block = "thumbnail_block";
  }
  render() {
    this.button = div(this.id + "child", "PageImageA", this.id);
    return div([this.button]);
  }
  async setPageData(pageData, imageData) {
    this.pageData = pageData;
    this.imageData = imageData;
    if (!pageData) {
      return;
    }
    this.pk = pageData.getPk();
    const binaryEntity = this.imageData
      ? this.imageData.binaryEntity
      : null;
    //console.log(binaryEntity)
    if (binaryEntity) {
      const data = {
        name: "page_" + this.listing,
        ab: binaryEntity._ab,
        type: binaryEntity.type
      }
      this.thumbnail = await this.ip.createImageNodeByData(data).catch((e) => {
        console.log(e);
        throw e
      });
      this.draggableArea.nowSelectedElm = this.thumbnail;
    }
  }
  render(store, actionData) {
    return div('', "");
  }
  remove(pk) {
    return(event) => {
      if (window.confirm("delete ok?")) {
        const action = PageActionCreator.creatRemoveAction(this, {imagePKforDelete: pk});
        this.dispatch(action);
      }
    }
  }
  handleDragStart(dragImageSrc) {
    return(event) => {
      const elm = event.target;
      this.parent.dropElm = null;
      if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
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
    return(event) => {
      const elm = event.target;
      if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
        return
      }
      event.preventDefault(); // Necessary. Allows us to drop.
      event.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
      return false;
    }
  }
  handleDragEnter() {
    return(event) => {
      const elm = event.target;
      if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
        return
      }
      elm.classList.add('over');
    }
  }
  handleDragLeave() {
    return(event) => {
      const elm = event.target;
      if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
        return
      }
      elm.classList.remove('over'); // this / event.target is previous target element.
    }
  }
  handleDrop(event) {
    return(event) => {
      event.stopPropagation(); // Stops some browsers from redirecting.
      event.preventDefault();
      const elm = event.target;
      if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
        return
      }
      this.parent.dropElm = elm;
      const nowSelectedElm = this.draggableArea.nowSelectedElm;
      if (nowSelectedElm && nowSelectedElm.dataset.pk && nowSelectedElm !== elm) {
        const selectedPk = nowSelectedElm.dataset.pk;
        const targetPk = elm.dataset.pk;
        if(nowSelectedElm.dataset.pk && nowSelectedElm.dataset.is_image){
          //console.log('sort handleDrop imagePKmove:' + nowSelectedElm+ "/elm.dataset.pk:" + elm.dataset.pk+"/targetPk:"+targetPk)
          const action = PageActionCreator.creatAddPageAction(this, {
            imagePk: selectedPk,
            pagePk: targetPk
          });
          this.dispatch(action);
        }else if(nowSelectedElm.dataset.pk && nowSelectedElm.dataset.is_page){
          //console.log('sort handleDrop imagePKmove:' + nowSelectedElm + "/elm.dataset.pk:" + elm.dataset.pk+"/targetPk:"+targetPk)
          const action = PageActionCreator.creatSortPagesAction(this, {
            imagePKmove: selectedPk,
            imagePKdrop: targetPk
          });
          //alert("creatSortPagesAction :"+nowSelectedElm.dataset.is_image+"/pk:"+nowSelectedElm.dataset.pk+"/"+elm.dataset.pk+"/"+elm.dataset.is_page);
          this.dispatch(action);
        }
      }
      return false;
    }
  }
  handleDragEnd(event) {
    return(event) => {
      const elm = event.target;
      const targetPk = elm.dataset.pk;
      console.log('sort handleDrop imagePKmove:' + this.draggableArea.nowSelectedElm + "/elm.dataset.pk:" + elm.dataset.pk+"/targetPk:"+targetPk)
      if (!elm.classList || !elm.classList.contains(this.thumbnail_block)) {
        return
      }
      this.parent.draggableArea.nowSelectedElm = null;
      elm.style.opacity = '1';
      const childNodes = elm.parentNode.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        const col = childNodes[i];
        col.classList.remove('over');
      }
    }
  }
  selectImage(event) {
    return(event) => {
      event.stopPropagation(); // Stops some browsers from redirecting.
      event.preventDefault();
      const elm = event.target;
      console.log('sort selecImage imagePKmove:/elm.dataset.pk:' + elm.dataset.pk+"/"+this.pageData)
      if (this.pageData && this.pageData.baseImage) {
        const action = ImageActionCreator.creatDetailAction(this, {imagePK: this.pageData.baseImage});
        this.dispatch(action);
      }
      return false;
    }
  }
  renderVnode(parent) {
    const pageEntity = this.pageData;
    if (!pageEntity) {
      return div(this.id, ["aaaaaaa" + this.listing], "null" + this.listing);
    }
    console.log("A binaryEntity 01")
    const src = this.thumbnail
      ? this.thumbnail.src
      : null;
    //console.log("A binaryEntity 02")
    const imgVnode = img(this.pk + "_page", "", "", src, {});
    //console.log("A binaryEntity 03")
    const rowVnode = div(this.id, ["thumbnail_block"], {
      on: {
        dragstart: this.handleDragStart(src),
        dragover: this.handleDragOver(),
        dragenter: this.handleDragEnter(),
        dragleave: this.handleDragLeave(),
        drop: this.handleDrop(),
        dragend: this.handleDragEnd(),
        click: this.selectImage()
      },
      dataset: {
        pk: this.pk,
        is_page:true
      },
      props: {
        "draggable": "true"
      }
    }, [div("", ["page_block"], [imgVnode])]);
    //console.log("A binaryEntity 04")
    parent.prePatch("#" + this.id, rowVnode);
    return rowVnode;
  }
  createVnode() {}
}
