import {ProgressBar} from "../view/parts/progressBar"
export class ViewPartsLoader {
    constructor(){
    }
    getIndigator(parent){
      if(!!this.pb===false){
        this.pb = new ProgressBar(parent);
      }
      return this.pb;
    }
}
