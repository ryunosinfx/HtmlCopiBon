import BaseEntity from "./baseEntity";
export default class Title extends BaseEntity{
  constructor(title) {
    super();
    this.name=title;
    this.target=target;
    this.no="";
    this.date="";
    this.pageNo=0;
    this.series=null;
  }
}
