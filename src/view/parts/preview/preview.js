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
import {PreviewActionCreator} from '../../../reduxy/action/previewActionCreator'
export class Preview extends BaseView {
  constructor() {
    super("Preview", "Preview", true);
    this.storeKey = PreviewActionCreator.getStorePreviewKey();
    this.previewOpenAction = PreviewActionCreator.creatOpenAction();
    this.previewCloseAction = PreviewActionCreator.creatCloseAction();
    this.previewNextAction = PreviewActionCreator.creatNextAction();
    this.previewBackAction = PreviewActionCreator.creatBackAction();
    this.list = [];
    this.currentSetNum = 0;
    this.isSingle = true;
    this.classNameRight = "previeRight";
    this.classNameLeft = "previeLeft";
    this.dummyClassName ="dummy";
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
    if (data) {
      const {isSingle, nowSetNum, list, type, setting} = data;
      if (isSingle!== undefined) {
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
      const isR2L = this.setting.pageDirection === "r2l";
       // console.log(this.list)
      // alert(this.list+"/isR2L:"+isR2L);
        // alert("list:"+this.list+"/isSingle:"+isSingle);
      if (list) {
        const pageNo = 1;
        this.pageNo = pageNo;
        this.showPreview(this.list, isSingle, this.pageNo, isR2L);
      } else if (this.previewNextAction.type === type) {
        console.log(type);
        if (pageSetCount > nowSetNum) {
          const pageNo = nowSetNum * 1 + 1;
          this.pageNo = pageNo;
          this.showPreview(this.list, isSingle, this.pageNo, isR2L);
        } else {
          return;
        }
      } else if (this.previewBackAction.type === type) {
        console.log(type);
        if (nowSetNum > 1) {
          const pageNo = nowSetNum * 1 - 1;
          this.pageNo = pageNo;
          this.showPreview(this.list, isSingle, this.pageNo, isR2L);
        } else {
          return;
        }
      }
      //console.log("Preview onViewShow");
    }
  }
  showPreview(list, isSingle, pageNo, isR2L) {
    const pageSet = list[pageNo - 1];
    let mainView = null;
    const leftText = isR2L
    ? "Next"
    : "Back";
    const rightText = isR2L
    ? "Back"
    : "Next";
    const left = div('', ['previewLeft',"button"], {
      on: {
        click: (
          isR2L
          ? this.goNext()
          : this.goBack())
      }
    }, [span('',[leftText,"button","symbol"],"<"),span('',[leftText,"button","text"],leftText)]);
    const right = div('', ['previewRight',"button"], {
      on: {
        click: (
          isR2L
          ? this.goBack()
          : this.goNext())
      }
    }, [span('',[rightText,"button","symbol"],">"),span('',[rightText,"button","text"],rightText)]);
    if (isSingle) {
      // console.log(pageSet)
      // alert(pageSet+"/pageNo:"+pageNo);
      const binary = pageSet.binary;
      const imgVnode = this.buildImageArea(binary,pageNo,null);
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
      const lNo = (pageNo-1) * 2 + (
        isR2L
        ? 1
        : 0);
      const rNo = (pageNo-1) * 2 + (
        isR2L
        ? 0
        : 1);
      const imgVnodeL = this.buildImageArea(pageSet[0].binary,lNo,false);
      const imgVnodeR = this.buildImageArea(pageSet[1].binary,rNo,true);
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
  buildImageArea(binalyEnitiy, pageNo, isRight) {
    const currentClass = isRight === null
      ? ""
      : (
        isRight
        ? this.classNameRight
        : this.classNameLeft);
    if(binalyEnitiy){
      const dataUri = bc.arrayBuffer2DataURI(binalyEnitiy._ab);
      // console.log(dataUri);
      const imgVnode = img(binalyEnitiy.pk + "_preview", "preview_" + pageNo, "", dataUri, {});
      const info = div('', ['previewInfo'], {}, "pageNo:" + pageNo);
      return div('', ['previewImageFrame'], {}, [info, imgVnode]);
    }else{
      const isDummy =  binalyEnitiy === undefined;
      const noimageMsg =isDummy ?"no Page":"no image set";
      const dummyClass = isDummy? this.dummyClassName :"";
      const pageNoString = isDummy? "----":"pageNo:" + pageNo;
      const imgVnode = div('', ['previewInfo'], {}, noimageMsg);
      const info = div('', ['previewInfo'], {},pageNoString );
      return div('', ['previewImageFrame',dummyClass], {}, [info, imgVnode]);
    }
  }
  beClose() {
    return(event) => {
      const action = PreviewActionCreator.creatCloseAction(this, {isSingle: this.isSingle});
      // alert("beClose");
      this.dispatch(action);
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
  goNext() {
    return(event) => {
      const action = PreviewActionCreator.creatNextAction(this, {
        isSingle: this.isSingle,
        pageNo: this.pageNo
      });
      this.dispatch(action);
      // alert("goNext");
      event.stopPropagation();
      return false;
    }
  }
  goBack() {
    return(event) => {
      const action = PreviewActionCreator.creatBackAction(this, {
        isSingle: this.isSingle,
        pageNo: this.pageNo
      });
      this.dispatch(action);
      // alert("goBack");
      event.stopPropagation();
      return false;
    }
  }
  closePreview() {
    // alert("beClose");
    this.currentVnode.elm.style.display = 'none';
  }
}
