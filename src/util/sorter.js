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
  static asc(colName, list) {
    list.sort((objA, objB) => {
      let a = objA[colName];
      let b = objB[colName];
      if (a < b)
        return -1;
      if (a > b)
        return 1;
      return 0;
    });
  }
  static desc(colName, list) {
    list.sort((objA, objB) => {
      let a = objA[colName];
      let b = objB[colName];
      if (a < b)
        return 1;
      if (a > b)
        return -1;
      return 0;
    });
  }

  static typeof() {}
}
