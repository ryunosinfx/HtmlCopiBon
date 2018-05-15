import MainFrame from "./view/mainFrame"
import MainService from "./service/mainService"
const title = "CopiBon";
const mainService = new MainService();
export default class CopiBonService {
  static main(){

    const mf = new MainFrame(mainService);
    mf.render(title);
  }
}
CopiBonService.main();
