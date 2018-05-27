import MainFrame from "./view/mainFrame"
import MainService from "./service/mainService"
const title = "CopiBon";
export default class CopiBonService {
  constructor() {
    this.mainService = new MainService();
    this.mf = new MainFrame(this.mainService);
  }
  async init() {
    await this.mainService.init();
    this.mf.render(title);
  }
  static main() {
    const self = new CopiBonService();
    self.init();
  }
}
CopiBonService.main();
