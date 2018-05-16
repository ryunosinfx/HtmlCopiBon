import StorageService from "./storageService";
import ViewPartsLoader from "./viewPartsLoader"

const title = "CopiBon";
const titlePrefix = "title_";
export default class MainServiceImpl {
  constructor() {
    this.vpl = new ViewPartsLoader();
    this.ss = new StorageService();
    this.ss.crateTitleStore();
  }
  async init() {
    await this.ss.loadAllData();
  }
  async save(pk,data) {
    let record = data?data:pk;
    await this.ss.save(data?pk:record.name, record);
  }
  async delete(pk) {
    await this.ss.delete(pk);
  }
  async loadImages() {
    this.ss.crateTitleStore();
    return await this.ss.loadAll();
  }
  getViewPartsLoader(){
    return this.vpl;
  }

}
