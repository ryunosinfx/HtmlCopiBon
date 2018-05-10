import vu from "../util/viewUtil";
export default class Container {
  constructor(){

  }
  render() {
    const container = vu.create("container", "container");
    return container;
  }
}
