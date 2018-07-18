import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../util/reactive/base/vtags";
export class Menu  extends BaseView {
  constructor() {
    super("Menu", "Menu");
    this.text="Menu";
    this.menuButtonClass="MenuButton";
  }
  render() {
    const button = div(this.id+'Frame', ["Menu"], this.createButtons());
    return button;
  }

  createButtons(){
    const menuTabs = [];
    menuTabs.push(div('',[this.menuButtonClass],'Step0 Select or New'))
    menuTabs.push(div('',[this.menuButtonClass],'Step1 Work Setting'))
    menuTabs.push(div('',[this.menuButtonClass],'Step2 Select Files'))
    menuTabs.push(div('',[this.menuButtonClass],'Step3 DExcport'))
    menuTabs.push(div('',[this.menuButtonClass],'Step4 Pref'))
    return menuTabs;
  }
}
