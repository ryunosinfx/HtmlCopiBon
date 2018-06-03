import vu from "../util/viewUtil";
import {Header} from "./header";
import {Container} from "./container";
import {Footer} from "./footer";
import {BaseView} from "../util/reactive/baseView";
export class MainFrame extends BaseView {
  constructor(ms) {
    super(null, "frame", "frame");
    this.ms = ms;
  }
  async render(titleText) {
    this.header = new Header(this);
    this.footer = new Footer(this);
    vu.append(this.elm, this.header.render(titleText));
    this.container = new Container(this);
    vu.append(this.elm, this.footer.render());
    vu.attachBody(this.elm);
  }

}
