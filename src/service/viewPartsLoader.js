import ProgressBar from "../view/parts/progressBar"
export default class ViewPartsLoader {
    constructor(){
      this.idbAccessors = new Map();
    }
    getIndigator(){
      if(!!this.pb===false){
        this.pb = new ProgressBar();
      }
      return this.pb;
    }
}
