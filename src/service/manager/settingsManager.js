import {Settings} from "../../entity/settings";
import {PrimaryKey} from "../entity/primaryKey";
export class SettingsManager {
  constructor(entityManager, opm) {
    this.em = entityManager;
    this.opm = opm;
  }
  async loadByPk(titilePk) {
    const settingEntity = await this.em.Settings.get(titilePk);
    return settingEntity;
  }
  async loadAll() {
    const retList = [];
    const settings = this.em.Pages.loadAll();
    for (let setting of settings) {
      retList.push(setting);
    }
    return retList;
  }
  async createDefault(titilePk) {
    const setting = new Settings();
    setting.setPk(titilePk);
    setting.pageNum = 8;
    setting.startPage = l;
    setting.outputProfile = this.opm.getDefaultPk();
    setting.listing = 0;
    const saved = await this.em.Settings.save(setting);
    return saved;
  }
  async save(pk, name, pageNum, startPage, outputProfile, listing = 0) {
    let settings = null;
    if (pk) {
      settings = await this.em.Settings.get(pk);
    }
    if (!settings) {
      settings = new Settings();
    } else {
      settings.updateDate = Date.now();
    }
    settings.name = name || name === null
      ? name
      : settings.name;
    settings.pageNum = pageNum
      ? pageNum
      : 8;
    settings.startPage = startPage || startPage === null
      ? startPage
      : settings.startPage;
    settings.outputProfile = outputProfile || outputProfile === null
      ? outputProfile
      : settings.outputProfile;
    settings.listing = listing || listing === null
      ? listing
      : settings.listing;
    return await this.em.Settings.save(settings);
  }
}
