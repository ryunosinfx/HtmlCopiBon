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
  static isPrimaryKey(value){
    return value && typeof value ==="string" && value.split(DELIMITER).length === 2;
  }

  static getPrimaryKey(value){
    if(value){
      if(PrimaryKey.isPrimaryKey(value)){
        return value;
      }else if(value.getEntityName && value.getPk){
        return value.getPk();
      }
      return null;
    }else{
      return value;
    }
  }
}
