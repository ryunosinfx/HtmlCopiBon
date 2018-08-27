
import {
  BaseView
} from "../../../util/reactive/baseView";
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
import {dpis, ExportOrders} from "../../../settings/exportSettings";
export class ExportOrderRow extends BaseView {
  constructor() {
    super("ExportOrderRow", "ExportOrderRow");
    this.selectOrder = null;
    this.ordersMap = {};
  }

  render(store, actionData) {
    const name = div("", ["TitleName"], "TitleName");
    return div("", [this.id + "Frame"], [name, div(this.imageAreaID, ["ImageDetailA"], this.id + "aaaaa")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}
  getCurrentSelected(){
    return this.ordersMap[this.selectOrder];
  }
  selectOrder(name){
    return (event)=>{
      this.selectOrder = name;

    }
  }

  buildRows(){
    const retList = [];
    const ordersList = ExportOrders;
    for(let order of ordersList){
      const name=order.orderName;
      this.ordersMap[name]= order;
      const id = "ExportOrderRow-"+name;
      const row = div(id,[name],{
        on:{click:this.selectOrder(name)}
      },span("",[],[name]));
      retList.push(row);
    }
    return retList;
  }
}
