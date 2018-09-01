import {Sorter} from "../../util/sorter";
import {MainService} from "../../service/mainService"
import {ProgressBarProcesser} from "./progressBarProcesser"
export class PreviewProcessor {
  constructor() {
    this.ms = MainService.getInstance();
    this.em = this.ms.em;
    this.tm = this.ms.tm;
    this.ip = this.ms.ip;
    this.previewMaxWidth = 1000;
    this.previewMaxHeight = 1000;
    this.pbp = new ProgressBarProcesser();
    this.progress = 0;
  }

  async loadPreviews() {
    this.pbp.open('Start page!');
    this.progress = 0;
    this.pbp.update(this.progress, 'loading Settings');
    const title = await this.tm.load();
    const pages = title.pages;
    const retPreviews = [];
    const pegaNum = pages.length;
    const stepNum = 4
    const progressUnit = 100 / (stepNum * pegaNum)
    let pageCount = 0;
    for (let pagePk of pages) {
      pageCount++;
      const pageStep = "[" + pageCount + "/" + pegaNum + "]";
      this.progress += progressUnit;
      this.pbp.update(this.progress, 'load pageEnitity' + pageStep);
      const pageEnitity = await this.em.get(pagePk);
      const previewThumbnail = pageEnitity.previewThumbnail;
      const baseImage = pageEnitity.baseImage;
      if (baseImage) {
        if (previewThumbnail) {
          this.progress += progressUnit * 3;
          this.pbp.update(this.progress, 'load binaryEntity' + pageStep);
          const binaryEntity = await this.em.get(previewThumbnail);
          retPreviews.push(binaryEntity);
        } else {
          this.progress += progressUnit;
          this.pbp.update(this.progress, 'load imageEntity' + pageStep);
          const imageEntity = await this.em.get(baseImage);
          this.progress += progressUnit;
          this.pbp.update(this.progress, 'load binaryEntity' + pageStep);
          const binaryEntity = await this.em.get(imageEntity.binary);
          //TODO mk previews
          //binaryEntity._ab = await this.ip.resize(binaryEntity._ab,this.previewMaxWidth,this.previewMaxHeight);
          this.progress += progressUnit;
          this.pbp.update(this.progress, 'resize As Paper B5_72dpi' + pageStep);
          binaryEntity._ab = await this.ip.resizeAsPaperB5_72(binaryEntity._ab);
          // console.log(newData.data);
          // console.log(binaryEntity._ab);
          // alert(binaryEntity._ab);
          retPreviews.push(binaryEntity);
        }
      } else {
        retPreviews.push(null);
      }
    }

    this.progress = 100;
    await this.pbp.update(this.progress, 'end all!');
    return retPreviews;
  }
  async shapeListBySets(previews, isSingle, setting) {
    const cratePageData = PreviewProcessor.getCratePageDataFunc();
    if (isSingle) {
      const retSetLis = [];
      for (let index in previews) {
        retSetLis.push(cratePageData(index * 1 + 1, false, false, previews, this.dummyClass));
      }
      await this.pbp.comple(this.progress);
      return retSetLis;
    } else {
      const pageNum = setting.pageNum * 1; //SettingData.pageNums[setting.pageNum-1]*1;
      this.pageNum = pageNum;
      await this.pbp.comple(this.progress);
      return PreviewProcessor.buildPageFrames(setting, previews, cratePageData, this.dummyClass);
    }
  }
  //
  static getCratePageDataFunc() {
    return(pageNo, className, isRight, binaries, dummyClass) => {
      return {
        pageNo: pageNo,
        isDummy: className === dummyClass,
        isRight: isRight,
        binary: binaries[pageNo - 1]
      }
    }
  }
  static buildPageFrames(setting, binaries, cratePageData, dummyClass) {
    const retFrames = [];
    const startPage = setting.startPage;
    const pageNum = setting.pageNum * 1; //SettingData.pageNums[setting.pageNum-1]*1;
    const pageDirection = setting.pageDirection;
    const isPageDirectionR2L = pageDirection === "r2l";
    const isPageStartR = startPage === "r";
    const frameNum = Math.ceil(pageNum / 2);
    const isOdd = (pageNum % 2 === 1);
    const isMatchPageStartSide = (pageDirection.indexOf(startPage) === 0);
    const addPageNum = isOdd
      ? 1
      : isMatchPageStartSide
        ? 0
        : 1;
    const totalPageFrame = frameNum * 1 + addPageNum * 1;
    const pageClass = "Page";
    const isStartFull = (isPageDirectionR2L && isPageStartR) || (!isPageDirectionR2L && !isPageStartR)
    const leftStartDummyClass = !isPageStartR || isStartFull
      ? ""
      : dummyClass;
    const rightStartDummyClass = isPageStartR || isStartFull
      ? ""
      : dummyClass;
    const leftEndDummyClass = (isOdd && (!isStartFull || (isStartFull && !isPageDirectionR2L))) || (!isOdd && (!isPageDirectionR2L || isStartFull))
      ? ""
      : dummyClass;
    const rightEndDummyClass = (isOdd && (!isStartFull || (isStartFull && isPageDirectionR2L))) || (!isOdd && (isPageDirectionR2L || isStartFull))
      ? ""
      : dummyClass;
    const lastIndex = totalPageFrame - 1;
    let pagNo = 0;
    let pageOffset = 0;
    //console.log("★lastIndex:"+lastIndex+"/pageNum:"+pageNum+"/setting.pageNum:"+setting.pageNum);
    for (let index = 0; index < totalPageFrame; index++) {
      const leftPageNo = (
        isPageDirectionR2L
        ? 1
        : 0) + pageOffset + pagNo;
      const rightPageNo = (
        isPageDirectionR2L
        ? 0
        : 1) + pageOffset + pagNo;
      const pagePair = [];
      retFrames.push(pagePair);
      //////////////////////////////////
      if (index === 0) { //LR
        const leftPageNoFirst = isPageDirectionR2L && isStartFull
          ? 2
          : isPageDirectionR2L
            ? 1
            : isStartFull
              ? 1
              : 0
        const rightPageNoFirst = isPageDirectionR2L && isStartFull
          ? 1
          : isPageDirectionR2L
            ? 0
            : isStartFull
              ? 2
              : 1
        pagePair.push(cratePageData(leftPageNoFirst, leftStartDummyClass, false, binaries, dummyClass));
        pagePair.push(cratePageData(rightPageNoFirst, rightStartDummyClass, true, binaries, dummyClass));
        pageOffset = 1;
        pagNo += isStartFull
          ? 2
          : 1;
      } else if (index === lastIndex) {
        pagePair.push(cratePageData(leftPageNo, leftEndDummyClass, false, binaries, dummyClass));
        pagePair.push(cratePageData(rightPageNo, rightEndDummyClass, true, binaries, dummyClass));
      } else {
        pagePair.push(cratePageData(leftPageNo, "", false, binaries, dummyClass));
        pagePair.push(cratePageData(rightPageNo, "", true, binaries, dummyClass));
        pagNo += 2;
      }
    }
    return retFrames;
  }
}
