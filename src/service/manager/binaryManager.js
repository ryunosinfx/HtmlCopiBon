import {Binary} from "../entity/binary";
import {PrimaryKey} from "../entity/primaryKey";
export class BinaryManager {
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
  async remove(pk) {
    let binaryPk = pk;
    if (!pk) {
      binaryPk = PrimaryKey.getPrimaryKey(pk);
    }
    return await this.em.Binary.delete(binaryPk);
  }
  async save(pk, name, binary) {
    // console.log("BinaryManager save!!A!! pk:" + pk);
    // console.log(binary);
    // console.log("BinaryManager save!!B!! name:" + name);
    let binEntity = null;
    if (pk) {
      binEntity = await this.em.Binary.get(pk);
    }
    console.log(binary);
    //alert(binary);
    let binaryPk = PrimaryKey.getPrimaryKey(binary);
    if (!binEntity) {
      binEntity = new Binary();
    } else {
      binEntity.updateDate = Date.now();
    }
    binEntity.binary = binaryPk
      ? binaryPk
      : binary;
    return await this.em.Binary.save(binEntity);
  }
}
