import {OutputProfile} from "../../entity/outputProfile";
import {PrimaryKey} from "../entity/primaryKey";
export class OutputProfileManager {
  constructor(entityManager) {
    this.em = entityManager;
  }
  static getDefault(){
    const outputProfileEntity="";
    return outputProfileEntity;
  }
  async loadAll() {
    const retList = [];
    const outputProfile = this.em.OutputProfile.loadAll();
    for(let page of pages){
      retList.push(page);
    }
    return retList;
  }
  async loadByPk(pk) {
    const outputProfilePK = PrimaryKey.getPrimaryKey(pk);
    const outputProfileEntity = await this.em.get(outputProfilePK);
    return outputProfileEntity;
  }
  async createDefault(){
      const outputProfile = new OutputProfile();
      const saved = await this.em.OutputProfile.save(outputProfile);
      return saved;
  }
  async save(pk, name, binary, type, width, height, listing = 0) {
    let image = null;
    if (pk) {
      image = await this.em.OutputProfile.get(pk);
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
