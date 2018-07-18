
import {Sorter} from "../../util/sorter";
import {MainService} from "../../service/mainService"
export class PageProcessor {
  constructor() {
    super();
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.pm = this.ms.pm;
    this.tm = this.ms.tm;
  }

  async resetPages(pageNum) {
    const title = await this.tm.load();
    const pages = title.pages;
    const pageEntitis = [];
    const delPages = [];
    let pageCount = 0;
    for (let index in pages) {
      const pk = pages[index];
      if (!pk) {
        continue;
      }
      const pageEntity = await this.em.get(pk);
      pageEntitis.push(pageEntity);
      pageCount++;
      if(pageCount > pageNum){
        delPages.push();
      }
    }
    for(let index in delPages){
      const delTarget = delPages[index];
      for (let i in pages) {
        const current = pages[i];
        if(delTarget === current){
          delete pages[i];
          this.pm.remove();
          break;
        }
      }

    }
    await this.tm.saveTitle(title);

  }
  async loadPages() {
    const title = await this.tm.load();
    const pages = title.pages;
    const pageEntitis = [];
    for (let index in pages) {
      const pk = pages[index];
      if (!pk) {
        continue;
      }
      const pageEntity = await this.em.get(pk);
      pageEntitis.push(pageEntity);
    }
  }
  async remove(pk) {
    await this.tm.removeImage(pk);
    loadedImageMap.delete(pk);
    return this.getRetObjsAsList();
  }

}
