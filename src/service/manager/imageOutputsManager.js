import {ImageOutputs} from "../../entity/imageOutputs";
import {PrimaryKey} from "../entity/primaryKey";
export class ImageOutputsManager {
  constructor(entityManager) {
    this.em = entityManager;
  }
  async load(pk) {
    let binaryPk = pk;
    if (!pk) {
      binaryPk = PrimaryKey.getPrimaryKey(pk);
    }
    return await this.em.ImageOutputs.get(binaryPk);
  }
  async remove(pk) {
    const target = await this.em.ImageOutputs.get(pk);
    if (target) {
      if (target.binary) {
        await this.em.Binary.delete(target.binary);
      }
      await this.em.ImageOutputs.delete(pk);
    }
  }
  async save(pk, name, binary, type, orderName, listing = 0) {
    let imageOutputs = null;
    if (pk) {
      imageOutputs = await this.em.ImageOutputs.get(pk);
    }
    let binaryPk = PrimaryKey.getPrimaryKey(binary);
    if (!imageOutputs) {
      imageOutputs = new ImageOutputs();
    } else {
      imageOutputs.updateDate = Date.now();
    }
    imageOutputs.name = name || name === null
      ? name
      : imageOutputs.name;
    imageOutputs.binary = binaryPk
      ? binaryPk
      : binary;
    imageOutputs.type = type || type === null
      ? type
      : imageOutputs.type;
    imageOutputs.orderName = orderName || orderName === null
      ? orderName
      : imageOutputs.orderName;
    imageOutputs.listing = listing || listing === null
      ? listing
      : imageOutputs.listing;
    const imageEntitySaved =  await this.em.ImageOutputs.save(imageOutputs);
    return PrimaryKey.getPrimaryKey(imageEntitySaved);
  }
}
