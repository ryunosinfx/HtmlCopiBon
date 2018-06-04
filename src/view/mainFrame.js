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
    this.header = new Header(this, titleText);
    this.footer = new Footer(this);

    this.header.attach(this);
    this.container = new Container(this);
    this.container.attach(this);
    this.footer.attach(this);
    vu.attachBody(this.elm);
  }

}
