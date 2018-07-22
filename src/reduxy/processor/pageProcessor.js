import {Sorter} from "../../util/sorter";
import {MainService} from "../../service/mainService"
export class PageProcessor {
  constructor() {
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.pm = this.ms.pm;
    this.tm = this.ms.tm;
  }

  async resetPages() {
    const setting = await this.tm.loadSettings();
    const pageNum = setting.pageNum;
    return await this.resetPages(pageNum);
  }
  async resetPages(pageNum) {
    const title = await this.tm.load();
    const pages = title.pages;
    const pageEntitis = [];
    const delPages = [];
    let pageCount = 0;
    if (pages.length > pageNum) {
      for (let index in pages) {
        const pk = pages[index];
        if (!pk) {
          continue;
        }
        const pageEntity = await this.em.get(pk);
        pageEntitis.push(pageEntity);
        pageCount++;
        if (pageCount > pageNum) {
          delPages.push(pk);
        }
      }
      for (let index in delPages) {
        const delTarget = delPages[index];
        for (let i in pages) {
          const current = pages[i];
          if (delTarget === current) {
            delete pages[i];
            this.pm.remove(delTarget);
            break;
          }
        }
      }
    } else {
      const addCount = pageNum - pages.length;
      for (let index = pages.length; index < pageNum; index++) {
        const addOne = await this.pm.save(null, null, null,null,null, index);
        pages.push(addOne);
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
    return pageEntitis;
  }
  async move(fromPk,toPk){
    await this.pm.move(fromPk,toPk)
  }
  async remove(pk) {
    await this.tm.removeImage(pk);
    loadedImageMap.delete(pk);
    return this.getRetObjsAsList();
  }

}
