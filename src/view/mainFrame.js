import vu from "../util/viewUtil";
import Footer from "./footer";
export default class MainFrame {
  constructor() {}
  render(titleText) {
    //alert("aaa");
    const frame = vu.create("frame", "frame");
    const content = vu.create("container", "container");
    const header = vu.create("header", "header");
    const title = vu.create("title", "title");
    const footer = vu.create("footer", "footer");
    //alert(frame.appendChild);
    vu.text(title,titleText)
    vu.append(header,title);
    vu.append(frame,header);
    vu.append(frame,content);
    vu.append(frame,(new Footer()).render());
    vu.attachBody(frame);
  }
}
