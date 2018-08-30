import {ProgressActionCreator} from "../action/progressActionCreator"
import {ActionDispatcher} from "../../util/reactive/actionDispatcher";
export class ProgressBarProcesser {
  constructor(pp) {
    this.actionDispatcher = ActionDispatcher.createStandAlone();
  }
  update(percentProgress,msg) {
    if (percentProgress < 100) {
      //this.progress.progress(percentLoaded);
      this.actionDispatcher.dispatch(ProgressActionCreator.creatUpdateAction(null,{progress:percentProgress,msg:msg}));
    }
  }
  comple(msg) {
    this.actionDispatcher.dispatch(ProgressActionCreator.creatCompleatAction(null,{msg:msg}));
  }
  open(msg) {
    this.actionDispatcher.dispatch(ProgressActionCreator.creatAddAction(null,{msg:msg}))
  }
  close() {
    this.actionDispatcher.dispatch(ProgressActionCreator.creatRemoveAction());
  }
}
