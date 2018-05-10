import vu from "../util/viewUtil";
export default class Footer {
  constructor() {
    this.copyright = "ryunosinfx";
  }
  render(title) {
    const footer = vu.create("footer", "footer");
    const copyright = vu.create("copyright", "copyright",this.copyright );
    vu.append(footer, copyright);
    return footer;
  }
}
