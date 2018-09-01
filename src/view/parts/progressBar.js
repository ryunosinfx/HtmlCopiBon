import vu from "../../util/viewUtil";
import {BaseView} from "../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../util/reactive/base/vtags";
import {ProgressViewReducer} from '../../reduxy/reducer/progressViewReducer'
export class ProgressBar extends BaseView {
  constructor() {
    super("ProgressBar", "ProgressBar");
    this.storeKey = "progress";
    this.initPoint = '0%';
    this.title = "ProgressBar";
  }

  onAfterAttach(store, data) {
    ProgressViewReducer.register();
  }
  render() {
    return div("" ["ProgressBarView"], {
      style: {
        display: "none"
      }
    }, [
      div('', ['progeressTitle'], ""),
      div('', ['progeressFrame'], [div('', ['progeress'], {
          style: {
            width: this.initPoint
          }
        })]),
      div('', ['progeressInfo'], [
        div('', ['progeressPoints'], this.initPoint),
        div('', ['progeressMessage'], "")
      ])
    ]);
  }
  async onViewShow(store, actionData) {
  console.log(store)
    if (store[this.storeKey]) {
      //alert("onViewShow");
      await this.showProgress(store[this.storeKey]);
      console.error(store[this.storeKey]);
      //console.log("ProgressBar onViewShow");
      if (store[this.storeKey].isComple) {
        alert(isComple);
      }
    }
  }
  async showProgress(data) {
    const {isVisible, progress, isComple, msg, title} = data;
    if (title) {
      this.title = title;
    }
    console.log(title+"/"+isComple)
    if (isComple) {
      alert(isComple);
    }
    if (isVisible) {
      this.currentVnode.elm.style.display = 'block';
      this.prePatch(".progeress", div("", ["progeress"], {
        style: {
          width: progress + "%"
        }
      },));
      this.prePatch(".progeressTitle", div("", ["progeressTitle"], {}, this.title));
      this.prePatch(".progeressPoints", div("", ["progeressPoints"], {}, progress + "%"));
      this.prePatch(".progeressMessage", div("", ["progeressMessage"], {}, msg));
      if (isComple) {
        alert(isComple);
        this.currentVnode.elm.style.display = 'none';
      }
    } else {
      alert(this.currentVnode.elm);
      this.currentVnode.elm.style.display = 'none';
      this.prePatch(".progeress", div("", ["progeress"], {
        style: {
          width: "0%"
        }
      }));
      this.prePatch(".progeressPoints", div("", ["progeressPoints"], {}, this.initPoint));
    }
  }
}
