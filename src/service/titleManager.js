import idb from "../util/idb/idbRapper"
import Title from "../entity/title";
import Img from "../entity/image";
import Thumbnale from "../entity/thumbnales";
import Series from "../entity/series";

const TITLE_STORE_NAME = "CopiBonTitles";
const defaultTitle = "CopiBon";
const defaultName = "DefaultName";
const defaultTitlePrefix = "title_";
export default class TitleManager {
  constructor(storageService, titleId) {
    this.ss = storageService;
    this.changeTitle(titleId);
  }
  async createTitle(titleId = defaultTitle, titlePrefix= defaultTitlePrefix, name= defaultName) {
    await this.ss.changeStore(TITLE_STORE_NAME);
    const title = new Title(titleId, titlePrefix, name);
    await this.ss.save(titleId, title);
    return title;
  }
  async changeTitle(newTitleId) {
    await this.currentTitle = await this.loadTitle(newTitleId);
    if (!this.currentTitle) {
      this.currentTitle = await this.createTitle(defaultTitle, defaultTitlePrefix, defaultName);
    }
  }
  async loadTitleList() {
    await this.ss.changeStore(TITLE_STORE_NAME);

    return
  }
  async loadTitle(titleId) {
    await this.ss.changeStore(TITLE_STORE_NAME);
    const loadObj = new Title(titleId, titlePrefix, name);
    return await this.ss.get(titleId,loadObj);
  }
  async saveTitle() {
    if (this.currentTitle) {
      this.currentTitle.updateDate = Date.now();
      await this.ss.save(this.currentTitle.titleId, this.currentTitle);
    }
  }
  async deleteTitleCascade() {
    const titelId = this.titelId;
    const titelPrefix = this.titelPrefix;
  }
  async addImage(name, dataURI) {}
  async removeImage(name, dataURI) {}
  async exportPDF() {}
  async exportZip() {}
}
