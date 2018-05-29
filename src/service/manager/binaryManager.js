import Binary from "../entity/binary";
import {PrimaryKey} from "../entity/primaryKey";
export default class BinaryManager {
  constructor(entityManager) {
    this.em = entityManager;
  }
  async load(pk) {
    let binaryPk = pk;
    if (!pk) {
      binaryPk = PrimaryKey.getPrimaryKey(pk);
    }
    return await this.em.Binary.get(binaryPk);
  }
  async save(pk, name, binary, type, width, height, listing = 0) {
    let image = null;
    if (pk) {
      image = await this.em.Binary.get(pk);
    }
    let binaryPk = PrimaryKey.getPrimaryKey(binary);
    if (!image) {
      image = new Binary();
    } else {
      image.updateDate = Date.now();
    }
    image.binary = binaryPk
      ? binaryPk
      : binary;
    return await this.em.Binary.save(data);
  }
}
