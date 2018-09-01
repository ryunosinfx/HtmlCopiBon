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
export class StepNextButton extends BaseView {
  constructor(currentStep) {
    super("StepNextButton", "StepNextButton");
    this.currentStep = currentStep;
  }

  render(store, actionData) {
    const name = div("", ["TitleName"], "TitleName");
    return div("", [this.id + "Frame"], [name, div(this.imageAreaID, ["ImageDetailA"], this.id + "aaaaa")]);
  }
  async onAfterAttach(store, data) {}

  async onViewShow(store, actionData) {}
}
