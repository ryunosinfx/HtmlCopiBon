import BaseEntity from "./baseEntity";
export default class Series extends BaseEntity{
  constructor(title) {
    super();
    this.id=title;
    this.name=title;
    this.target=target;
    this.no="";
    this.date="";
    this.pageNo=0;
  }
}
