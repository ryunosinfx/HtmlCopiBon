import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../util/reactive/base/vtags";
export class Menu  extends BaseView {
  constructor() {
    super("menu", "Menu");
    this.text="Menu";
    this.menuButtonClass="MenuButton";
    this.selected ="";
    this.idOfStep0 ='step0'
    this.idOfStep1 ='step1'
    this.idOfStep2 ='step2'
    this.idOfStep3 ='step3'
    this.idOfStep4 ='step4'
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
    menuTabs.push(div('',[this.menuButtonClass],{on:{click:this.onClick(this.idOfStep0)}},'Step0 Select or New'))
    menuTabs.push(div('',[this.menuButtonClass],{on:{click:this.onClick(this.idOfStep1)}},'Step1 Work Setting'))
    menuTabs.push(div('',[this.menuButtonClass],{on:{click:this.onClick(this.idOfStep2)}},'Step2 Select Files'))
    menuTabs.push(div('',[this.menuButtonClass],{on:{click:this.onClick(this.idOfStep3)}},'Step3 Export'))
    menuTabs.push(div('',[this.menuButtonClass],{on:{click:this.onClick(this.idOfStep4)}},'Step4 Pref'))
    return menuTabs;
  }
}
