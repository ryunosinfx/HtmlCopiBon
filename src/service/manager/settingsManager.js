import {
  Settings
} from "../../entity/settings";
import {
  PrimaryKey
} from "../entity/primaryKey";
export class SettingsManager {
  constructor(entityManager, opm) {
    this.em = entityManager;
    this.opm = opm;
  }
  async loadByPk(pk) {
    const settingPk = PrimaryKey.getPrimaryKey(pk);
    const settingEntity = await this.em.get(settingPk);
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
  async createDefault(titile) {
    const setting = new Settings();
    setting.pageNum = 8;
    setting.startPage = l;
    setting.OutputProfile = null;
    setting.listing = 0;
    const saved = await this.em.Settings.save(setting);
    return saved;
  }
  async save(pk, name, binary, type, width, height, listing = 0) {
    let image = null;
    if (pk) {
      image = await this.em.Settings.get(pk);
    }
    let binaryPk = PrimaryKey.getPrimaryKey(binary);
    if (!image) {
      image = new Settings();
    } else {
      image.updateDate = Date.now();
    }
    image.name = name || name === null ?
      name :
      image.name;
    image.binary = binaryPk ?
      binaryPk :
      binary;
    image.type = type || type === null ?
      type :
      image.type;
    image.width = width || width === null ?
      width :
      image.width;
    image.height = height || height === null ?
      height :
      image.height;
    image.listing = listing || listing === null ?
      listing :
      image.listing;
    return await this.em.Thumbnales.save(image);
  }
}
