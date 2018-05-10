import vu from "../util/viewUtil";
import fua from "./content/fileUploadArea";
export default class Container {
  constructor(){

  }
  render() {
    const container = vu.create("container", "container");
    vu.append(container,(new fua()).render());
    return container;
  }
}
