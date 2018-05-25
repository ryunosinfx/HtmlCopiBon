import BaseEntity from "./baseEntity";
const DELIMITER = "-";
export class PrimaryKey {
  constructor(pk) {
    this.pk = pk;
  }

  static getDelimiter() {
    return "-";
  }

  static assemblePK(entity, number) {
    return entity.getEntityName() + DELIMITER + number;
  }
}
