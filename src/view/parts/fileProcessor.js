import vu from "../../util/viewUtil";
import bc from "../../util/binaryConverter";
import {
  PrimaryKey
} from "../../service/entity/primaryKey";
import {
  Sorter
} from "../../util/sorter";
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
// import {FileUploadExecuter} from "../../service/fileUploadExecuter";
import {
  ImageActionCreator
} from '../../reduxy/action/imageActionCreator'
import {
  ImageViewReducer
} from '../../reduxy/reducer/imageViewReducer'
export class FileProcessor extends BaseView {
  constructor() {
    super("FileProcessor", "FileProcessor");
    this.ip = this.ms.ip;
    ImageViewReducer.register();
  }
  onAfterAttach(store, data) {
    const action = ImageActionCreator.creatLoadImagesAction(this, {});
    this.dispatch(action);
  }

  async onViewShow(store, actionData) {
  }
  render() {
    console.log("A0 FileProcessor render");
    const imageArea = div("imageArea", "AAAAAAAAAAAAAAAAAAAAAAAA");
    return div("", [imageArea]);
  }
}
