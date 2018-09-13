import vu from "../../../util/viewUtil";
import {BaseView} from "../../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../../util/reactive/base/vtags";
import {SplashActionCreator} from '../../../reduxy/action/splashActionCreator'
import {SplashViewReducer} from '../../../reduxy/reducer/splashViewReducer'
export class Splash extends BaseView {
  constructor() {
    super("Splash", "Splash",true);
    this.splashAddAction = SplashActionCreator.creatAddAction();
    this.splashRemoveAction = SplashActionCreator.creatRemoveAction();
    this.storeKey = SplashActionCreator.getStoreKey();
    this.titleText = this.ms.getAppTitle();
    this.Version =  this.ms.getAppVersion();
    this.message = "Now loading...";
  }
  async onAfterAttach(store, data) {
    SplashViewReducer.register();
  }
  render() {
    const appTitle = div('', ["appTitle"], [div('',["text"],this.titleText)]);
    const appVerion = div('', ["appVerion"], [div('',["text"],this.Version)]);
    const loadingspans= [];
    const chars = this.message.split("");
    for(let char of chars){
      loadingspans.push(span('',[],char));
    }
    const message = div('', ["message"], [div('',[this.id+"MsgText","loader"],loadingspans)]);

    return div(this.id, ["Splash"], [appTitle,appVerion,message]);
  }
  async onViewShow(store, actionData) {
    const data = store[this.storeKey];
    if (data) {
      if(data.isVisible===false){
        this.close();
      }
      //alert("OK");
    }
  }
}
