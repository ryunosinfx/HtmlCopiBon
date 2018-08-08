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
import {
  ExportButton
} from '../parts/export/exportButton'
import {
  ExportOrderList
} from '../parts/export/exportOrderList'
export class ExportArea extends BaseView {
  constructor() {
    super("ExportArea", "ExportArea");
    this.text = "ExportArea";
    this.exportButton = new ExportButton();
    this.exportOrderList = new ExportOrderList();
  }

  onAfterAttach(store, data) {
    this.exportOrderList.attach(this);
    this.exportButton.attach(this);
  }
  render() {
    return div(this.id, ["ExportArea"], [
      div('', [''], this.text),
      div(this.exportOrderList.id),
      div(this.pageImages.id)
    ]);
  }
}
