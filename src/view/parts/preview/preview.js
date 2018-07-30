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
import {
  PreviewReducer
} from '../../../reduxy/reducerpPreviewReducer'
export class Preview extends BaseView {
  constructor() {
    super("Preview", "Preview");
    this.storeKey = PreviewReducer.getStorePreviewKey();
    this.list=[];
    this.currentSetNum = 0;
    this.closeActionType ="closePreview";
  }
  onAfterAttach(store, data) {
    PreviewReducer.register();
  }
  render() {
    return div("" ["PreviewView"], {
      style: {
        display: "none"
      }
    }, [
      div('', ['previewFrame'], [div('', ['preview'], {
          style: {
            width: this.initPoint
          }
        })]),
      div('', ['previewPoints'], this.initPoint)
    ]);
  }
  async onViewShow(store, actionData) {
    const data = store[this.storeKey];
    if (data) {
      const {isSingle, nowSetNum, list,type} = data;
      if (list) {
        this.list = list;
      }else if(type === this.closeActionType){
        this.list = null;

        return;
      }

      //console.log("Preview onViewShow");
    }
  }
  beClose(){
    return (event)=>{
      const action = PreviewActionCreator.creatCloseAction();
      this.despatch()
    }
  }
  goNext(){
    return (event)=>{
      const action = PreviewActionCreator.creatCloseAction();
      this.despatch()
    }
  }
  closePreview(){
    this.currentVnode.elm.style.display = 'none';
  }
  showPreview(list,isSingle) {
      this.currentVnode.elm.style.display = 'block';
      this.prePatch(".preview", div("", ["preview"], {
        style: {
          width: progress + "%"
        }
      },));
      this.prePatch(".previewPoints", div("", ["previewPoints"], {}, progress + "%"));
      if (isComple) {
        setTimeout(() => {
        }, 1000)
      }
    } else {
      this.currentVnode.elm.style.display = 'none';
      this.prePatch(".preview", div("", ["preview"], {
        style: {
          width: "0%"
        }
      }));
      this.prePatch(".previewPoints", div("", ["previewPoints"], {}, this.initPoint));
    }
  }

  buildPreview(){
      this.currentVnode.elm.style.display = 'block';
  }

  showPreview(data) {
      this.currentVnode.elm.style.display = 'block';
      this.prePatch(".preview", div("", ["preview"], {
        style: {
          width: progress + "%"
        }
      },));
      this.prePatch(".previewPoints", div("", ["previewPoints"], {}, progress + "%"));
      if (isComple) {
        setTimeout(() => {
          this.currentVnode.elm.style.display = 'none';
        }, 1000)
      }
    } else {
      this.currentVnode.elm.style.display = 'none';
      this.prePatch(".preview", div("", ["preview"], {
        style: {
          width: "0%"
        }
      }));
      this.prePatch(".previewPoints", div("", ["previewPoints"], {}, this.initPoint));
    }
  }
}
