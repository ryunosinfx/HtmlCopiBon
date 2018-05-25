import idb from "../util/idb/idbRapper"
import Title from "../entity/title";
import Img from "../entity/images";
import Thumbnale from "../entity/thumbnales";
import Series from "../entity/series";
import {PrimaryKey} from "./entity/primaryKey";

const TITLE_STORE_NAME = "CopiBonTitles";
const defaultTitle = "CopiBon";
const defaultName = "DefaultName";
const defaultTitlePrefix = "title_";
export default class TitleManager {
  constructor(entityManager, titleId) {
    this.em = entityManager;
  }
  async load(titleId=defaultTitle) {
    const title = await this.em.Title.get(titleId);
    if(title){
      for(let index in title.images){
        const image = title.images[index];
        if(PrimaryKey.isPrimaryKey(image)){
          title.images[index] = await this.em.get(image);
        }
      }
      return title;
    }else{
      return await this.createTitle(titleId);
    }
  }

  async createTitle(titleId = defaultTitle, titlePrefix= defaultTitlePrefix, name= defaultName) {
    const title = new Title(titleId, titlePrefix, name);
    await this.em.Title.save(title);
    return title;
  }

  async changeTitle(newTitleId) {
    this.currentTitle = await this.loadTitle(newTitleId);
    if (!this.currentTitle) {
      this.currentTitle = await this.createTitle(defaultTitle, defaultTitlePrefix, defaultName);
    }
  }
  async loadTitleList() {
    return await this.em.Title.loadAllData();;
  }
  async saveTitle(title) {
    if (title) {
      title.updateDate = Date.now();
      await this.em.Title.save(title);
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
