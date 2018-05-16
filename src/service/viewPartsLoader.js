import ProgressBar from "../view/parts/progressBar"
export default class ViewPartsLoader {
    constructor(){
    }
    getIndigator(){
      if(!!this.pb===false){
        this.pb = new ProgressBar();
      }
      return this.pb;
    }
}
