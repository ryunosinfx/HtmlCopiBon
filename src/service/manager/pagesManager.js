import {Pages} from "../../entity/pages";
import {PrimaryKey} from "../entity/primaryKey";
export class PagesManager {
  constructor(entityManager) {
    this.em = entityManager;
  }
  async loadFromImagePk(pk) {
    const pagePk = PrimaryKey.getPrimaryKey(pk);
    const pageEntity = await this.em.get(pagePk);
    if (!pageEntity || !pageEntity.thumbnail) {
      return null;
    }
    const thumbnailPk = PrimaryKey.getPrimaryKey(pageEntity.thumbnail);
    const thumbnailEntity = await this.em.get(thumbnailPk);
    thumbnailEntity.parentPk = pagePk;
    return thumbnailEntity
  }
  async remove(pk) {
    const target = await this.em.Pages.get(pk);
    if (target) {
      if (target.previewThumbnail) {
        await this.em.Binary.delete(target.previewThumbnail);
      }
      if (target.outputImage) {
        await this.em.Binary.delete(target.outputImage);
      }
      await this.em.Pages.delete(pk);
    }
  }
  async move(fromPk, toPk) {
    const targetFrom = await this.em.Pages.get(fromPk);
    const targetTo = await this.em.Pages.get(toPk);
    const previewThumbnailFrom = targetFrom.previewThumbnail;
    const previewThumbnailTo = targetTo.previewThumbnail;
    const outputImageFrom = targetFrom.outputImage;
    const outputImageTo = targetTo.outputImage;
    targetFrom.previewThumbnail= previewThumbnailTo;
    targetTo.previewThumbnail= previewThumbnailFrom;
    targetFrom.outputImage= outputImageTo;
    targetTo.outputImage= outputImageFrom;
    await this.em.Pages.save(targetFrom);
    await this.em.Pages.save(targetTo);
  }
  async loadAll() {
    const retList = [];
    const pages = this.em.Pages.loadAll();
    for (let page of pages) {
      retList.push(page);
    }
    return retList;
  }
  async load(pk) {
    return await this.em.Pages.get(pk);
  }
  /*
  */
  async save(pk, previewThumbnail, outputImage, listing = 0) {
    let page = null;
    if (pk) {
      page = await this.em.Pages.get(pk);
    }
    //let binaryPk = PrimaryKey.getPrimaryKey(binary);
    if (!page) {
      page = new Pages();
    } else {
      page.updateDate = Date.now();
    }
    page.previewThumbnail = previewThumbnail || previewThumbnail === null
      ? previewThumbnail
      : page.previewThumbnail;
    page.outputImage = binaryPk
      ? binaryPk
      : binary;
    page.outputImage = outputImage || outputImage === null
      ? outputImage
      : page.outputImage;
    page.listing = listing || listing === null
      ? listing
      : page.listing;
    return await this.em.Pages.save(page);
  }
}
