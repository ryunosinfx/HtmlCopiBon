const IMAGE_STORE_SAFFIX ="_IMAGE";
export default class IdCreator {
  static createTitleImageStoreName(titeId) {
    return titeId+IMAGE_STORE_SAFFIX;
  }
}
