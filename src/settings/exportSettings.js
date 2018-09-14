const ua = navigator.userAgent.replace(/[\.0-9]+/g, "x");
const domain = window.location;
const A5 = {};
export default {
  A5: A5
}
export const SettingData = {
  pageStart: {
    l: "fromLeft",
    r: "fromRight"
  },
  pageDirection: {
    l2r: "LeftToRight",
    r2l: "RightToLeft"
  },
  pageNums: [1, 2, 4, 6, 8, 10, 12, 16]
}
export const PrefareceData = {
  previewSizeSingle: {
    w400: 400,
    w500: 500,
    w800: 800,
    w1000: 1000
  },
  e: {
    w400: 400,
    w500: 500,
    w800: 800,
    w1000: 1000
  }
}
export const dpis = {
  dpi72: 72,
  dpi150: 150,
  dpi300: 300,
  dpi350: 350,
  dpi600: 600,
  dpi1200: 1200,
  same: 0
}
export const printMargin = {
  none: 0,
  conbini: 5
}
export const basePaper = {
  B6: {
    target: "B6",
    frame: "B6",
    multiple: 1
  },
  A5: {
    target: "A5",
    frame: "A5",
    multiple: 1
  },
  B5: {
    target: "B5",
    frame: "B5",
    multiple: 1
  },
  A4: {
    target: "A4",
    frame: "A4",
    multiple: 1
  },
  mangaPaperB5: {
    target: "A5",
    frame: "B5",
    multiple: 1
  },
  mangaPaperA4: {
    target: "B5",
    frame: "A4",
    multiple: 1
  },
  mangaPaperA4ExpandTatikiri: {
    target: "B5",
    frame: "A4",
    multiple: (274 / 257)
  },
  mangaPaperB4: {
    target: "A4",
    frame: "B4",
    multiple: 1
  },
  mangaPaperA3: {
    target: "B4",
    frame: "A3",
    multiple: 1
  },
  pure_fit: {
    target: "same",
    frame: "same",
    multiple: 1
  }
}
export const paperSizeSet = {
  A6: {
    x: 105,
    y: 148
  },
  B6: {
    x: 128,
    y: 182
  },
  A5: {
    x: 148,
    y: 210
  },
  B5: {
    x: 182,
    y: 257
  },
  A4: {
    x: 210,
    y: 297
  },
  B4: {
    x: 257,
    y: 364
  },
  A3: {
    x: 297,
    y: 420
  }
}

export const ExportOrders = [ //
{
  orderName: "B6 none croping",
  basePaper: "B6"
},
  {
    orderName: "A5 none croping",
    basePaper: "A5"
  },
  {
    orderName: "B5 none croping",
    basePaper: "B5"
  },
  {
    orderName: "A4 none croping",
    basePaper: "A4"
  },
  {
    orderName: "B4 none croping",
    basePaper: "B4"
  },
  {
    orderName: "Manga Paper B5 Tatikiri to A5",
    basePaper: "mangaPaperB5"
  },
  {
    orderName: "Manga Paper A4 Tatikiri to B5",
    basePaper: "mangaPaperA4"
  },
  {
    orderName: "Manga Paper B4 Tatikiri to A4",
    basePaper: "mangaPaperB4"
  },
  {
    orderName: "Manga Paper A4 ExpandTatikiriSpecial",
    basePaper: "mangaPaperA4ExpandTatikiri"
  }
];
