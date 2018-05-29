import Title from "../../entity/title";
import Thumbnale from "../../entity/thumbnales";
import Series from "../../entity/series";
import {PrimaryKey} from "../entity/primaryKey";

const TITLE_STORE_NAME = "CopiBonTitles";
const defaultTitle = "CopiBon";
const defaultName = "DefaultName";
const defaultTitlePrefix = "title_";
export default class TitleManager {
  constructor(entityManager, titleId) {
    this.em = entityManager;
    console.log("title is new!!");
    //this.load(titleId).then((title)=>{this.currentTitle=title;console.log("title is new!")});
  }
  async loadCurrent() {
    return this.currentTitle;
  }
  async load(titleId = defaultTitle) {
    console.log("title is titleId!!" + titleId);
    if (this.currentTitle && this.currentTitle.getPk() === titleId) {
      return this.currentTitle;
    }
    console.log("title is titleId!!A!" + titleId);
    let title = await this.em.Title.get(titleId);
    console.log(title);
    console.log("title is titleId!!B!" + titleId);
    if (title) {
      for (let index in title.images) {
        const image = title.images[index];
        if (PrimaryKey.isPrimaryKey(image)) {
          title.images[index] = await this.em.get(image);
        }
      }
      console.log("title is titleId!2!" + titleId);
    } else {
      console.log("title is titleId!3!" + titleId);
      title = await this.createTitle(titleId);
    }
    console.log("title is title!!" + title);
    this.currentTitle = title;
    return title;
  }

  async createTitle(titleId = defaultTitle, titlePrefix = defaultTitlePrefix, name = defaultName) {
    const title = new Title(titleId, titlePrefix, name);
    title.setPk(titleId);
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
      this.currentTitle = await this.em.Title.save(title);
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
