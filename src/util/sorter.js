const order = {
  'number': 1,
  'string': 2,
  'boolean': 3,
  'object': 4,
  'function': 5,
  'symbol': 6,
  'undefined': 7
};

export default class Sorter {
  constructor() {}
  static asc(list, colName) {
    const func = Sorter.execute([{colName:colName,isDESC:false}]);
    list.sort(func);
  }
  static desc(list, colName) {
    const func = Sorter.execute([{colName:colName,isDESC:true}]);
    list.sort(func);
  }
  static orderBy(list, orders){
    const func = Sorter.execute(orders);
    list.sort(func);
  }
  static execute(orders){
    return (objA, objB) => {
      for(let order of orders){
        const {colName,isDESC} = order;
        let a = objA[colName];
        let b = objB[colName];
        if (a < b){
          return isDESC ? -1:1;
        }else if (a > b){
          return isDESC ? 1:-1;
        }
      }
      return 0;
    };
  }

  static typeof() {}
}
