import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../../util/reactive/base/vtags";
export class Splash  extends BaseView {
  constructor() {
    super("Splash", "Splash");
  }
  render() {
    const appTitle = div('',[],'');
      const appVerion = div('',[],'');
        const meesage = div('',[],'');

    return div(this.id, ["Splash"], [appTitle]);
  }
  // loadTitleList
  // newTitle
  // deleteTitle
  // next Button
