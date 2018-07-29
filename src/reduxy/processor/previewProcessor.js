import {Sorter} from "../../util/sorter";
import {MainService} from "../../service/mainService"
export class PreviewProcessor {
  constructor() {
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.tm = this.ms.tm;
  }

  async loadPreviews() {
    const title = await this.tm.load();
    const pages = title.pages;
    const retPreviews = [];
    for (let pagePk of pages) {
      const pageEnitity = this.em.get(pagePk);
      const previewThumbnail = pageEnitity.previewThumbnail;
      const baseImage = pageEnitity.baseImage;
      if (baseImage) {
        if (outputImage) {
          const binaryEntity = this.em.get(outputImage);
          retPreviews.push(binaryEntity);
        } else {
          const imageEntity = this.em.get(baseImage);
          const binaryEntity = this.em.get(imageEntity.binary);
          //TODO mk previews
          retPreviews.push(binaryEntity);
        }
      } else {
        retPreviews.push(null);
      }
    }
    return retPreviews;
  }
}
