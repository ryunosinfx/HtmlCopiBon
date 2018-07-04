import Pages from "../../entity/pages";
import {PrimaryKey} from "../entity/primaryKey";
export class PagesManager {
  constructor(entityManager) {
    this.em = entityManager;
  }
  async loadFromImagePk(pk) {
    const imagePk = PrimaryKey.getPrimaryKey(pk);
    const imageEntity = await this.em.get(imagePk);
    if(!imageEntity || !imageEntity.thumbnail){
      return null;
    }
    const thumbnailPk  = PrimaryKey.getPrimaryKey(imageEntity.thumbnail);
    const thumbnailEntity = await this.em.get(thumbnailPk);
    thumbnailEntity.parentPk = imagePk;
    return thumbnailEntity
  }
  async load(pk) {
    let binaryPk = pk;
    if (!pk) {
      binaryPk = PrimaryKey.getPrimaryKey(pk);
    }
    return await this.em.Thumbnales.get(binaryPk);
  }
  async save(pk, name, binary, type, width, height, listing = 0) {
    let image = null;
    if (pk) {
      image = await this.em.Thumbnales.get(pk);
    }
    let binaryPk = PrimaryKey.getPrimaryKey(binary);
    if (!image) {
      image = new Thumbnales();
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
