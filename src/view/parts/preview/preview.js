import vu from "../../../util/viewUtil";
import {BaseView} from "../../../util/reactive/baseView";
import {
  a,
  div,
  li,
  ul,
  img,
  span,
  input,
  label
} from "../../../util/reactive/base/vtags";
import {PreviewReducer} from '../../../reduxy/reducerpPreviewReducer'
export class Preview extends BaseView {
  constructor() {
    super("Preview", "Preview");
    this.storeKey = PreviewReducer.getStorePreviewKey();
    this.previewOpenAction = PreviewActionCreator.creatOpenAction();
    this.previewCloseAction = PreviewActionCreator.creatCloseAction();
    this.previewNextAction = PreviewActionCreator.creatNextAction();
    this.previewBackAction = PreviewActionCreator.creatBackAction();
    this.list = [];
    this.currentSetNum = 0;
    this.isSingle = true;
    this.closeActionType = this.previewCloseAction.type;
  }
  onAfterAttach(store, data) {
    PreviewReducer.register();
  }
  render() {
    const viewFrame = div('', ['previewFrame'], [
      div('', ['previewLeft'], "<")div('', ['preview'], {
        style: {
          width: "100%"
        }
      }),

      div('', ['previewRight'], ">")
    ])
    return div("" ["PreviewView"], {
      style: {
        display: "none"
      },
      on: {
        click: this.beClose();
      }
    }, [viewFrame]);
  }
  async onViewShow(store, actionData) {
    const data = store[this.storeKey];
    if (data) {
      const {isSingle, nowSetNum, list, type, setting} = data;
      if (setting) {
        this.setting = setting;
      }
      if (list) {
        this.list = list;
      } else if (type === this.previewCloseAction.type) {
        this.list = null;
        this.closePreview();
        return;
      }

      this.currentVnode.elm.style.display = 'block';
      const pageSetCount = this.list.length;
      const isR2L = setting.pageDirection === "r2l";
      if (list) {
        const pageNo = 1;

      } else if (this.previewNextAction.type === action.type) {
        if (pageSetCount > nowSetNum) {
          const pageNo = nowSetNum + 1;

        } else {
          return;
        }
      } else if (this.previewBackAction.type === action.type) {
        if (nowSetNum > 1) {
          const pageNo = nowSetNum - 1;
        } else {
          return;
        }

      }
      //console.log("Preview onViewShow");
    }
  }
  beClose() {
    return(event) => {
      const action = PreviewActionCreator.creatCloseAction(this, {isSingle: this.isSingle});
      this.despatch()
    }
  }
  goNext() {
    return(event) => {
      const action = PreviewActionCreator.creatNextAction(this, {isSingle: this.isSingle});
      this.despatch(action);
    }
  }
  goBack() {
    return(event) => {
      const action = PreviewActionCreator.creatBackAction(this, {isSingle: this.isSingle});
      this.despatch(action);
    }
  }
  closePreview() {
    this.currentVnode.elm.style.display = 'none';
  }
  showPreview(list, isSingle, pageNo, isR2L) {
    const pageSet = pageSet[pageNo - 1];
    let mainView = null;
    const left = div('', ['previewLeft'], {
      on: {
        click: (isR2L?  this.goNext() : this.goBack())
      }
    }, "<");
    const right = div('', ['previewRight'], {
      on: {
        click: (isR2L? this.goBack() : this.goNext())
      }
    }, ">");
    if (isSingle) {
      const dataUri = bc.arrayBuffer2DataURI(pageSet._ab);
      const imgVnode = img(pk + "_preview", "preview_"+pageNo, "", dataUri, {});

      mainView = div('', ['preview'], {
        style: {
          width: "100%"
        }
      },[imgVnode]);
    } else {
      //
      const lNo = pageNo*2+(isR2L?1:0);
      const rNo = pageNo*2+(isR2L?0:1);
      const dataUriL = bc.arrayBuffer2DataURI(pageSet[0]._ab);
      const imgVnodeL = img(pk + "_preview", "preview_"+pageNo ,"", dataUriL, {});
      const dataUriR = bc.arrayBuffer2DataURI(pageSet[1]._ab);
      const imgVnodeR = img(pk + "_preview", "preview_"+pageNo, "", dataUriR, {});
    }
    this.prePatch(".preview", div("", ["preview"], {
      style: {
        width: progress + "%"
      }
    }, [left, mainView, right]));
  }
}
