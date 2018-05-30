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
    if (this.currentTitle && this.currentTitle.getPk() === titleId) {
      return this.currentTitle;
    }
    let title = await this.em.Title.get(titleId);
    console.log(title);
    if (title) {
      for (let index in title.images) {
        const image = title.images[index];
        if (PrimaryKey.isPrimaryKey(image)) {
          console.log(image);
          const imageEntity = await this.em.get(image);
          title.images[index] = imageEntity;
        }
      }
    } else {
      title = await this.createTitle(titleId);
    }
    this.currentTitle = title;
    console.log(title);
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
  async removeImage(pk) {
    const title = await this.load();
    console.log("this.tm.loadCurrent");
    console.log(title);
    const images = title.images;
    console.log(pk);
    console.log(images);
    for(let index in images){
      const imageEntity = images[index];
      if(PrimaryKey.getPrimaryKey(imageEntity) === pk){
        delete images[index];
        await this.em.delete(pk);
        const binaryPk = PrimaryKey.getPrimaryKey(imageEntity.binary);
        await this.em.delete(binaryPk);
        const thumbnailPk = PrimaryKey.getPrimaryKey(imageEntity.thumbnail);
        const thumbnailEntity = await this.em.get(thumbnailPk);
        await this.em.delete(thumbnailPk);
        const thumbnailBinaryPk = PrimaryKey.getPrimaryKey(thumbnailEntity.binary);
        await this.em.delete(thumbnailBinaryPk);
      };
    }
    console.log(images);
    await this.tm.saveTitle(title);

  }
  async exportPDF() {}
  async exportZip() {}
}
