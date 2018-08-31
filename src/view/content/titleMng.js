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
  StorageMeter
} from '../parts/titleMng/storageMeter'
import {
  TitleList
} from '../parts/titleMng/titleList'
import {
  TitleNewone
} from '../parts/titleMng/titleNewone'
import {
  StorageInitializer
} from '../parts/titleMng/storageInitializer'
export class TitleMng extends BaseView {
  constructor() {
    super("TitleMng", "TitleMng");
    this.text = "TitleMng";
    this.storageMeter = new StorageMeter(this);
    this.titleList = new TitleList(this);
    this.titleNewone = new TitleNewone(this);
    this.storageInitializer = new StorageInitializer(this);
  }
  onAfterAttach(store, data) {
    this.storageMeter.attach(this);
    this.titleList.attach(this);
    this.titleNewone.attach(this);
    this.storageInitializer.attach(this);
  }
  render() {
    return div(this.id, ["TitleMng"], [
      div("",['name'],'Title Manager'),
      div(this.storageMeter.id),
      div(this.titleList.id),
      div(this.titleNewone.id),
      div(this.storageInitializer.id)
    ]);
  }
  // loadTitleList
  // newTitle
  // deleteTitle
  // next Button
}
