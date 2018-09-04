import vu from "../../../util/viewUtil";
import bc from "../../../util/binaryConverter";
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
import {PreviewReducer} from '../../../reduxy/reducer/previewReducer'
import {ImageActionCreator} from '../../../reduxy/action/imageActionCreator'
import {PreviewActionCreator} from '../../../reduxy/action/previewActionCreator'
export class Preview extends BaseView {
  constructor() {
    super("Preview", "Preview", true);
    this.storeKey = PreviewActionCreator.getStorePreviewKey();
    this.storeUpdateKey = PreviewActionCreator.getStoreUpdatePreviewKey();
    this.previewOpenAction = PreviewActionCreator.creatOpenAction();
    this.previewCloseAction = PreviewActionCreator.creatCloseAction();
    this.previewNextAction = PreviewActionCreator.creatNextAction();
    this.previewBackAction = PreviewActionCreator.creatBackAction();
    this.list = [];
    this.currentSetNum = 0;
    this.isSingle = true;
    this.classNameRight = "previeRight";
    this.classNameLeft = "previeLeft";
    this.dummyClassName = "dummy";
    this.closeActionType = this.previewCloseAction.type;
  }
  onAfterAttach(store, data) {
    PreviewReducer.register();
  }
  render() {
    const viewFrame = div('', ['previewFrame'], [
      div('', ['previewLeft'], "<"),
      div('', ['previewFrameA'], {
        style: {
          width: "100%"
        }
      }),
      div('', ['previewRight'], ">")
    ])
    return div(this.id, ["Preview"], {
      style: {
        display: "none"
      },
      on: {
        click: this.beClose()
      }
    }, [viewFrame]);
  }
  async onViewShow(store, actionData) {
    const data = store[this.storeKey];
    const dataUpdate = store[this.storeUpdateKey];
    if (dataUpdate && this.list) {
      const {page, pk} = dataUpdate;
      for (let index in this.list) {
        const pageData = this.list[index];
        if (pageData.parentPk === pk) {
          pageData.parent = page;
          this.showPreview(this.list, this.isSingle, this.pageNo, this.isR2L);
          break;
        }
      }
    }
    if (data) {
      const {isSingle, nowSetNum, list, type, setting} = data;
      if (isSingle !== undefined) {
        this.isSingle = isSingle;
      }
      if (setting) {
        this.setting = setting;
      }
      if (list) {
        this.list = list;
      } else if (type === this.previewCloseAction.type) {
        this.list = null;
        // alert("onViewShow beClose");
        this.closePreview();
        return;
      }
      this.currentVnode.elm.style.display = 'block';
      const pageSetCount = this.list.length;
      this.isR2L = this.setting.pageDirection === "r2l";
      // console.log(this.list)
      // alert(this.list+"/isR2L:"+isR2L);
      // alert("list:"+this.list+"/isSingle:"+isSingle);
      if (list) {
        const pageNo = 1;
        this.pageNo = pageNo;
        this.showPreview(this.list, isSingle, this.pageNo, this.isR2L);
      } else if (this.previewNextAction.type === type) {
        if (pageSetCount > nowSetNum) {
          const pageNo = nowSetNum * 1 + 1;
          this.pageNo = pageNo;
          this.showPreview(this.list, isSingle, this.pageNo, this.isR2L);
        } else {
          return;
        }
      } else if (this.previewBackAction.type === type) {
        if (nowSetNum > 1) {
          const pageNo = nowSetNum * 1 - 1;
          this.pageNo = pageNo;
          this.showPreview(this.list, isSingle, this.pageNo, this.isR2L);
        } else {
          return;
        }
      }
      //console.log("Preview onViewShow");
    }
  }
  showPreview(list, isSingle, pageNo, isR2L) {

    console.warn("showPreview isR2L:" + isR2L);
    const pageSet = list[pageNo - 1];
    let mainView = null;
    const leftText = isR2L
      ? "Next"
      : "Back";
    const rightText = isR2L
      ? "Back"
      : "Next";
    const left = div('', [
      'previewLeft', "button"
    ], {
      on: {
        click: this.goNextOrBack(false)
      }
    }, [
      span('', [
        leftText, "button", "symbol"
      ], "<"),
      span('', [
        leftText, "button", "text"
      ], leftText)
    ]);
    const right = div('', [
      'previewRight', "button"
    ], {
      on: {
        click: this.goNextOrBack(true)
      }
    }, [
      span('', [
        rightText, "button", "symbol"
      ], ">"),
      span('', [
        rightText, "button", "text"
      ], rightText)
    ]);
    if (isSingle) {
      // console.log(pageSet)
      // alert(pageSet+"/pageNo:"+pageNo);
      const imgVnode = this.buildImageArea(pageSet, pageNo, null);
      //alert("isSingle:"+isSingle+"/pageNo:"+pageNo+"/dataUri:"+dataUri);
      mainView = div('', ['preview_single'], {
        style: {
          width: "100%"
        },
        on: {
          click: this.doNothing()
        }
      }, [imgVnode]);
    } else {
      // console.log(list);
      // alert("AAAlist:"+list+"/isSingle:"+isSingle);
      const lNo = (pageNo - 1) * 2 + (
        isR2L
        ? 1
        : 0);
      const rNo = (pageNo - 1) * 2 + (
        isR2L
        ? 0
        : 1);
      const one = pageSet[0];
      const two = pageSet[1];
      const imgVnodeL = this.buildImageArea(one, lNo, false);
      const imgVnodeR = this.buildImageArea(two, rNo, true);
      mainView = div('', ['preview_dual'], {
        style: {
          width: "100%"
        },
        on: {
          click: this.doNothing()
        }
      }, [imgVnodeL, imgVnodeR]);
    }
    this.prePatch(".previewFrame", div("", ["previewFrame"], {
      style: {}
    }, [left, mainView, right]));
  }
  buildImageArea(pageData, pageNo, isRight) {
    const pageEnitiy = pageData.parent;
    // alert(JSON.stringify(pageEnitiy));
    this.parentPkRight = isRight?pageData.parentPk:this.parentPkRight;
    this.parentPkLeft = !isRight?pageData.parentPk:this.parentPkLeft;
    const binalyEnitiy = pageData.binary;
    const isForceColor = pageEnitiy?pageEnitiy.isForceColor:null;
    const isNoCropping = pageEnitiy?pageEnitiy.isNoCropping:null;
    const isForceColorClass = isForceColor
      ? "enable"
      : "disable";
    const isNoCroppingClass = isNoCropping
      ? "enable"
      : "disable";
    const currentClass = isRight === null
      ? ""
      : (
        isRight
        ? this.classNameRight
        : this.classNameLeft);
    if (binalyEnitiy) {
      const dataUri = bc.arrayBuffer2DataURI(binalyEnitiy._ab);
      // console.log(dataUri);
      const imgVnode = img(binalyEnitiy.pk + "_preview", "preview_" + pageNo, "", dataUri, {});
      const pageNoText = div('', ["pageNo"], {}, "pageNo:" + pageNo);
      const checkForceColor = div('', [
        "checkForceColor", isForceColorClass
      ], {
        on: {
          click: this.onCheckUpdate( "isForceColor",isRight)
        }
      }, "isForceColor");
      const checkNoCropping = div('', [
        "checkNoCropping", isNoCroppingClass
      ], {
        on: {
          click: this.onCheckUpdate("isNoCropping",isRight)
        }
      }, "isNoCropping:");
      const info = div('', ['previewInfo'], {}, [pageNoText,div('',["options"],[checkForceColor,checkNoCropping])]);
      return div('', ['previewImageFrame'], {}, [info, imgVnode]);
    } else {
      const isDummy = binalyEnitiy === undefined;
      const noimageMsg = isDummy
        ? "no Page"
        : "no image set";
      const dummyClass = isDummy
        ? this.dummyClassName
        : "";
      const pageNoString = isDummy
        ? "----"
        : "pageNo:" + pageNo;
      const imgVnode = div('', ['previewInfo'], {}, noimageMsg);
      const info = div('', ['previewInfo'], {}, pageNoString);
      return div('', [
        'previewImageFrame', dummyClass
      ], {}, [info, imgVnode]);
    }
  }
  onCheckUpdate(key,isRight) {
    return(event) => {
      const action = PreviewActionCreator.creatUpdateAction(this, {
        pk: pk,
        key: key
      });
      // alert("beClose");
      this.dispatch(action);
      event.stopPropagation();
      return false;
    }
  }
  beClose() {
    return (event) => {
      const action = PreviewActionCreator.creatCloseAction(this, {
        isSingle: this.isSingle
      });
      // alert("beClose");
      this.dispatch(action);
      const actionReload = ImageActionCreator.creatLoadImagesAction(this, {});
      this.dispatch(actionReload);
      event.stopPropagation();
      return false;
    }
  }
  doNothing() {
    return(event) => {
      event.stopPropagation();
      return false;
    }
  }
  goNextOrBack(isRight) {
    return(event) => {
      const action = ((isRight && this.isR2L) || (!isRight && !this.isR2L))
        ? PreviewActionCreator.creatBackAction(this, {
          isSingle: this.isSingle,
          pageNo: this.pageNo
        })
        : PreviewActionCreator.creatNextAction(this, {
          isSingle: this.isSingle,
          pageNo: this.pageNo
        });
      this.dispatch(action);
      // alert("goNext");
      event.stopPropagation();
      return false;
    }
  }
  closePreview() {
    // alert("beClose");
    this.currentVnode.elm.style.display = 'none';
  }
}
