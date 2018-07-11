import vu from "../util/viewUtil";
import {Header} from "./header";
import {Container} from "./container";
import {Footer} from "./footer";
import {BaseView} from "../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../util/reactive/base/vtags";
export class MainFrame extends BaseView {
  constructor(ms,title) {
    super("frame", "frame");
    this.ms = ms;
    BaseView.setMainService(ms);
    this.initialize(title);
  }
  initialize(title) {
    this.header = new Header(title);
    this.footer = new Footer();
    this.container = new Container();
    this.baseFrame = null;
    this.view = '';
    this.initialPatch();
  }
  async onViewShow(store, data){
    this.header.attach(this,'#header');
    this.container.attach(this,'#container');
    this.footer.attach(this,'#footer');
  }
  render(titleText) {
    let newVnode = div('frame', ['frame'], {}, [
      div('header', {
        style: {
          color: '#000'
        }
      }, 'hellow!!'),
      div('menu', {
        style: {
          color: '#000'
        }
      }, 'menu!!'),
      div('container', {
        style: {
          color: '#000'
        }
      }, [div('content', {
          style: {
            color: '#000'
          }
        },'content!!')], 'container!!'),
      div('footer', {
        style: {
          color: '#000'
        }
      }, 'footer!!?')
    ]);
    return newVnode;
  }
}
