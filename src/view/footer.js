import vu from "../util/viewUtil";
import {BaseView} from "../util/reactive/baseView";
import {a,div,li,ul,img,span,input,label} from "../util/reactive/base/vtags";
export class Footer extends BaseView {
  constructor() {
    super("footer", "footer");
    this.copyright = "ryunosinfx";
  }
  render() {
    const newVnode = div({
      style: {
        color: '#000'
      }
    }, [div("copyright", ["copyright"], this.copyright)]);
    return newVnode;
  }
}
