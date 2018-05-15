import MainServiceImpl from "./mainServiceImpl"
const mainServiceImpl = new MainServiceImpl();
export default class MainService {
  static getInstance(){
    return mainServiceImpl;
  }
}
