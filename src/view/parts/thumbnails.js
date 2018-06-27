import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {
  Sorter
} from "../../util/sorter";
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
import {ImageActionCreator} from '../../reduxy/action/imageActionCreator'
export class Thumbnails extends BaseView {
  constructor() {
    super("Thumnails", "Thumnails");
    this.thumbnails = [];
  }
  onAfterAttach(store, data) {
  }
  async onViewShow(store, actionData) {
    if (store.imagesData) {
      await this.showImages(store.imagesData);
      console.log("Thumnails onViewShow");
    }
  }
  render(store, actionData) {
    return div("","Thumnails");
  }
  async showImages(iamageEntitis) {
    const diff = iamageEntitis.length -this.thumbnails.length;
    if(diff > 0){
      for(let i =0;i<diff;i++){

      }
    }
    Sorter.orderBy(iamageEntitis, [{
      colName: "listing",
      isDESC: false
    }, {
      colName: "updateDate",
      isDESC: true
    }]);
    const images = [];
    for (let imageData of iamageEntitis) {
      if (!imageData) {
        continue;
      }
      images.push(await this.crateDataLine(imageData).catch((e) => {
        console.log(e)
      }))
    }
    this.prePatch("#imageArea", div("imageArea", images));
  }
  remove(pk) {
    return (event)=>{
      if (window.confirm("delete ok?")) {
        const action = ImageActionCreator.creatRemoveAction(this, {imagePKforDelete:pk});
        this.dispatch(action);
      }
    }
  }
  async crateDataLine(){
    
  }
}
