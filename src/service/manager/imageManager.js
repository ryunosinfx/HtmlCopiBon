import Images from "../../entity/images";
import {PrimaryKey} from "../entity/primaryKey";
export default class ImageManager {
  constructor(entityManager) {
    this.em = entityManager;
  }
  async load(pk) {
    let binaryPk = pk;
    if (!pk) {
      binaryPk = PrimaryKey.getPrimaryKey(pk);
    }
    return await this.em.Images.get(binaryPk);
  }
  async save(pk, name, binary, type, width, height, thunbnail, listing = 0) {
    let image = null;
    if (pk) {
      image = await this.em.Images.get(pk);
    }
    let binaryPk = PrimaryKey.getPrimaryKey(binary);
    if (!image) {
      image = new Images();
    } else {
      image.updateDate = Date.now();
    }

    console.log("ImageManager save!!A!! image:"+image);
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
    image.thunbnail = thunbnail || thunbnail === null
      ? thunbnail
      : image.thunbnail;
    image.listing = listing || listing === null
      ? listing
      : image.listing;
    const savedData = await this.em.Images.save(image);
          console.log("ImageManager save!!B!! image:"+savedData);
    return savedData;
  }
}
