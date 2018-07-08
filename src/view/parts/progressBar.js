import vu from "../../util/viewUtil";
import {
  BaseView
} from "../../util/reactive/baseView";
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
export class ProgressBar extends BaseView {
  constructor() {
    super("ProgressBar", "ProgressBar");
    this.storeKey = "progress";
    this.initPoint = '0%';
  }

  render() {
    return div("" ["ProgressBarView"], {
      style: {
        display: "none"
      }
    }, [
      div('', ['progeressFrame'], [
        div('', ['progeress'], {
          style: {
            width: this.initPoint
          }
        })
      ]),
      div('', ['progeressPoints'], this.initPoint)
    ]);
  }
  async onViewShow(store, actionData) {
    if (store.progress) {
      await this.showProgress(store.progress);
      console.log("ProgressBar onViewShow");
    }
  }
  showProgress(data) {
    const {
      isVisible,
      progress,
      isComple
    } = data;
    if (isVisible) {
      this.currentVnode.elm.style.display = 'block';
      this.prePatch(".progeress", div("", ["progeress"], {
        style: {
          width: progress + "%"
        }
      }, ));
      this.prePatch(".progeressPoints", div("", ["progeressPoints"], {}, progress + "%"));
      if (isComple) {
        setTimeout(() => {
          this.currentVnode.elm.style.display = 'none';
        }, 1000)
      }
    } else {
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
