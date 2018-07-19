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
export class StepPrevButton extends BaseView {
  constructor(currentStep) {
    super("StepPrevButton", "StepPrevButton");
    this.currentStep = currentStep;
  }

  render(store, actionData) {
    const name = div("", ["TitleName"], "TitleName");
    return div("", [this.id + "Frame"], [name, div(this.imageAreaID, ["ImageDetailA"], this.id + "aaaaa")]);
  }
  onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}
}
