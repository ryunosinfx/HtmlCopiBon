import {Setting} from "../../entity/setting";
import {PrimaryKey} from "../entity/primaryKey";
export class SettingsManager {
  constructor(entityManager) {
    this.em = entityManager;
  }
  async loadByPk(pk) {
    const settingPk = PrimaryKey.getPrimaryKey(pk);
    const settingEntity = await this.em.get(settingPk);
    return settingEntity;
  }
  async save(pk, name, binary, type, width, height, listing = 0) {
    let image = null;
    if (pk) {
      image = await this.em.Setting.get(pk);
    }
    let binaryPk = PrimaryKey.getPrimaryKey(binary);
    if (!image) {
      image = new Setting();
    } else {
      image.updateDate = Date.now();
    }
    image.name = name || name === null
      ? name
      : image.name;
    image.binary = binaryPk
      ? binaryPk
      : binary;
    image.type = type || type === null
      ? type
      : image.type;
    image.width = width || width === null
      ? width
      : image.width;
    image.height = height || height === null
      ? height
      : image.height;
    image.listing = listing || listing === null
      ? listing
      : image.listing;
    return await this.em.Thumbnales.save(image);
  }
}
