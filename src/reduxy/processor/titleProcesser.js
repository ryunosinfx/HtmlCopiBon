import {TitleActionCreator} from "../action/ｔitleActionCreator"
import {ActionDispatcher} from "../../util/reactive/actionDispatcher";
import {ObjectUtil} from "../../util/objectUtil";
export class TitleProcesser {
  constructor(em, tm) {
    this.em = em;
    this.tm = tm;
    this.actionDispatcher = ActionDispatcher.createStandAlone();
    this.totalSize = 0;
  }
  async loadAll() {
    const titles = await this.tm.loadTitleList();
    this.totalSize = 0;
    for (let title of titles) {
      const size = await this.getSizes(title);
      title.size = size;
      this.totalSize += size;
    }

    return {list:titles,totalSize:this.totalSize };
  }
  getTotalSum() {
    return this.totalSize;
  }
  async getSizes(target) {
    if (!target) {
      return 1;
    }
    let size = ObjectUtil.calcSize(target);
    const refCols = title.getRefCols();
    for (let colName of refCols) {
      const entity = await this.em.get(refCols);
      size += await this.getSizes(entity);
    }
    return size;
  }
  async clearAll() {
    const titles = await this.tm.loadTitleList();
    for (let title of titles) {
      await this.removeDescendant(title);
    }
    return await this.loadAll();
  }
  async removeDescendant(target) {
    if (!target) {
      return;
    }
    const refCols = target.getRefCols();
    for (let colName of refCols) {
      const colValue = target[colName];
      if (!colValue) {
        continue;
      }
      if (Array.isArray(colValue)) {
        for (let pk of colValue) {
          await this.removeExecute(pk);
        }
      } else if (typeof colValue === "string") {
        await this.removeExecute(colValue);
      }
    }
  }
  async removeExecute(pk) {
    const entity = await this.em.get(pk);
    if (entity) {
      await this.removeDescendant(entity);
      await this.em.delete(pk);
      const titles = await this.tm.loadTitleList();
      return titles && titles.length > 0
        ? titles[0]
        : null
    }
    return this.tm.loadCurrent();
  }
  async create(titleId, titlePrefix, name) {
    if (await this.tm.isExist(titleId)) {
      return async this.tm.load(titleId) ;
    }
    return await this.tm.createTitle(titleId, titlePrefix, name);
  }
  async remove(titleId) {
    if (await this.tm.isExist(titleId)) {
      return await this.removeExecute(titleId);
    } else {
      return this.tm.loadCurrent();
    }
  }
  async changeTtitle(titleId) {
    return await this.tm.changeTitle(titleId);
  }
  async update(titleId, name) {
    const current = await this.tm.load(titleId);
    current.name = name;
    await this.tm.saveTitle(current);
    return this.tm.loadCurrent();
  }
}
