import MainServiceImpl from "./mainServiceImpl"
const mainServiceImpl = new MainServiceImpl();
const currentSiries = "";
const currentTitle = "";
export default class MainService {
  static getInstance(){
    return mainServiceImpl;
  }
  async init(){
    await mainServiceImpl.init();
  }
}
