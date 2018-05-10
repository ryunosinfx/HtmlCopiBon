import vu from "../util/viewUtil";
import Header from "./header";
import Container from "./container";
import Footer from "./footer";
export default class MainFrame {
  constructor() {}
  render(titleText) {
    //alert("aaa");
    const frame = vu.create("frame", "frame");
    const footer = vu.create("footer", "footer");
    //alert(frame.appendChild);
    vu.append(frame,(new Header()).render(titleText));
    vu.append(frame,(new Container()).render());
    vu.append(frame,(new Footer()).render());
    vu.attachBody(frame);
  }
}
