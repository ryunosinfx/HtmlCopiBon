import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../util/reactive/base/vtags";
export class Menu  extends BaseView {
  constructor() {
    super("menu", "Menu");
    this.text="Menu";
    this.menuButtonClass="MenuButton";
    this.selected ="";
    this.anckerOfStep0 ='#'+'step0'
    this.anckerOfStep1 ='#'+'step1'
    this.anckerOfStep2 ='#'+'step2'
    this.anckerOfStep3 ='#'+'step3'
    this.anckerOfStep4 ='#'+'step4'
    this.idOfStep0 ='step0'
    this.idOfStep1 ='step1'
    this.idOfStep2 ='step2'
    this.idOfStep3 ='step3'
    this.idOfStep4 ='step4'
    this.idOfStepLabel0 ='Step0 Select or New'
    this.idOfStepLabel1 ='Step1 Work Setting'
    this.idOfStepLabel2 ='Step2 Select Files'
    this.idOfStepLabel3 ='Step3 Export'
    this.idOfStepLabel4 ='Step4 Pref'

  }
  render() {
    return div(this.id+'Frame', ["MenuFrame"], this.createButtons());
  }

  onClick(id){
    return (event)=>{
      alert("onClick id:"+id);
    }
  }
  createButtons(){
    const menuTabs = [];
    menuTabs.push(a('',[this.menuButtonClass],this.anckerOfStep1,{on:{click:this.onClick(this.idOfStep0)}},this.idOfStepLabel0))
    menuTabs.push(a('',[this.menuButtonClass],this.anckerOfStep1,{on:{click:this.onClick(this.idOfStep1)}},this.idOfStepLabel1))
    menuTabs.push(a('',[this.menuButtonClass],this.anckerOfStep2,{on:{click:this.onClick(this.idOfStep2)}},this.idOfStepLabel2))
    menuTabs.push(a('',[this.menuButtonClass],this.anckerOfStep3,{on:{click:this.onClick(this.idOfStep3)}},this.idOfStepLabel3))
    menuTabs.push(a('',[this.menuButtonClass],this.anckerOfStep4,{on:{click:this.onClick(this.idOfStep4)}},this.idOfStepLabel4))
    return menuTabs;
  }
}
