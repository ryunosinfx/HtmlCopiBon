import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
import {PageActionCreator} from '../../reduxy/action/pageActionCreator'
export class PageImage  extends BaseView {
  constructor(listing) {
    super("PageImage"+listing, "PageImage");
    this.listing = listing;
    this.thumbnail = null;
    this.dragElm = null;
    this.thumbnail_block = "thumbnail_block";
  }
  render() {
    this.button = div(this.id+"child", "PageImageA", this.id);
    return div( [this.button]);
  }
  async setPageData(pageData, imageData) {
    this.pageData = pageData;
    this.imageData = imageData;
    if(!pageData){
      return ;
    }
    const binaryEntity = this.imageData?this.imageData.binaryEntity:null;
    console.log(binaryEntity)
    if(binaryEntity){
        const data = {
          name: "page_"+this.listing,
          ab: binaryEntity._ab,
          type: binaryEntity.type
        }
        this.thumbnail = await this.ip.createImageNodeByData(data).catch((e) => {
          console.log(e);
          throw e
        });
    }
  }
  render(store, actionData) {
    return div('', "");
  }
  remove(pk) {
    return (event) => {
      if (window.confirm("delete ok?")) {
        const action = PageActionCreator.creatRemoveAction(this, {
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
        const action = PageActionCreator.creatSortImagesAction(this, {
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
        const action = PageActionCreator.creatDetailAction(this, {
          imagePK: elm.dataset.pk
        });
        this.dispatch(action);
      return false;
    }
  }
  renderVnode(parent) {
    const pageEntity = this.pageData;
    if(!pageEntity){
        return div(this.id,["aaaaaaa"+this.listing],"null"+this.listing);
    }
    console.log("A binaryEntity 01")
    const pk = pageEntity.getPk();
    console.log("A binaryEntity 02")
    const src = this.thumbnail? this.thumbnail.src :null;
    const imgVnode = img(pk + "_page", "", "", src, {});
    console.log("A binaryEntity 03")
    const rowVnode = div(this.id, ["thumbnail_block"], {
      on: {
        dragstart: this.handleDragStart(src),
        dragover: this.handleDragOver(),
        dragenter: this.handleDragEnter(),
        dragleave: this.handleDragLeave(),
        drop: this.handleDrop(),
        dragend:this.handleDragEnd(),
        click:this.selectImage()
      },
      dataset:{pk:pk},
      props:{ "draggable":"true",'data-pk':pk}
    }, [div("", ["page_block"],[imgVnode])]);
    console.log("A binaryEntity 04")

    parent.prePatch("#" + this.id, rowVnode);
    return rowVnode;
  }
  createVnode(){

  }
}
