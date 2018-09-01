import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "html": {
        "minHeight": "100%",
        "width": "100%",
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0,
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "body": {
        "minHeight": "100%",
        "width": "100%",
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0,
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "div": {
        "boxSizing": "border-box"
    },
    "divframe": {
        "minHeight": "99%",
        "width": "100%",
        "marginLeft": 0,
        "marginRight": 0,
        "marginTop": 0,
        "marginBottom": 0,
        "border": "solid 1px blue"
    },
    "divfooter": {
        "minHeight": "100%",
        "width": "100%",
        "border": "solid 1px red",
        "paddingTop": 0.5,
        "paddingRight": 0.5,
        "paddingBottom": 0.5,
        "paddingLeft": 0.5
    },
    "divcopyright": {
        "width": "100%",
        "paddingTop": 0.5,
        "paddingRight": 0.5,
        "paddingBottom": 0.5,
        "paddingLeft": 0.5,
        "textAlign": "center"
    },
    "divheader": {
        "minHeight": "100%",
        "width": "100%",
        "border": "solid 1px green",
        "paddingTop": 0.2,
        "paddingRight": 0.2,
        "paddingBottom": 0.2,
        "paddingLeft": 0.2
    },
    "divtitle": {
        "fontSize": 2,
        "fontWeight": "bold",
        "backgroundColor": "#c23cc1",
        "paddingTop": 0.5,
        "paddingRight": 0.5,
        "paddingBottom": 0.5,
        "paddingLeft": 0.5
    },
    "divFileUploadArea input": {
        "position": "absolute",
        "left": -100
    },
    "divFileUploadArea": {
        "display": "block",
        "minHeight": "100%",
        "width": "100%",
        "border": "dotted 1px black",
        "backgroundColor": "#a8bae0",
        "paddingTop": 5,
        "paddingBottom": 5,
        "textAlign": "center",
        "fontSize": 2
    },
    "inputFileUploadFile": {
        "position": "absolute",
        "top": -10,
        "left": 10,
        "visibility": "hidden"
    },
    "divFilesArea": {
        "minHeight": "100%",
        "width": "100%",
        "border": "dotted 1px black",
        "backgroundColor": "rgb(124, 110, 241)",
        "paddingTop": 1,
        "paddingBottom": 1,
        "textAlign": "center",
        "fontSize": 2
    },
    "spanimageDataLine": {
        "display": "inline-block",
        "fontSize": "50%",
        "paddingTop": 0.2,
        "paddingRight": 0.2,
        "paddingBottom": 0.2,
        "paddingLeft": 0.2
    },
    "divdelButton": {
        "display": "inline-block",
        "fontSize": "50%",
        "width": 3,
        "paddingTop": 0.2,
        "paddingRight": 0.2,
        "paddingBottom": 0.2,
        "paddingLeft": 0.2,
        "lineHeight": 1,
        "textAlign": "center",
        "cursor": "pointer",
        "backgroundColor": "#675275"
    },
    "divdelButton:active": {
        "color": "red"
    },
    "divdelButton:hover": {
        "color": "#d48a60",
        "backgroundColor": "#7b4f99"
    },
    "canvashidden": {
        "position": "absolute",
        "top": -10000
    },
    "[draggable]": {
        "userSelect": "none"
    },
    "column": {
        "height": 150,
        "width": 150,
        "float": "left",
        "border": "2px solid #666666",
        "backgroundColor": "#ccc",
        "marginRight": 5,
        "borderRadius": 10,
        "boxShadow": "inset 0 0 3px #000",
        "textAlign": "center",
        "cursor": "move"
    },
    "columnover": {
        "border": "2px dashed #000"
    },
    "column header": {
        "color": "#fff",
        "textShadow": "#000 0 1px",
        "boxShadow": 5,
        "borderBottom": "1px solid #ddd",
        "borderTopLeftRadius": 10,
        "borderTopRightRadius": 10
    },
    "FilesArea>div": {
        "width": "100%",
        "minWidth": 630,
        "display": "flex",
        "flexWrap": "wrap",
        "flexDirection": "row"
    },
    "FilesArea>div>div": {
        "display": "flex",
        "minWidth": 160,
        "overflow": "hidden"
    },
    "FilesArea>div>divPageImages": {
        "minWidth": 320,
        "maxWidth": "50%"
    },
    "FilesArea>div>divImageDetail": {
        "minWidth": 160,
        "maxWidth": "25%"
    },
    "ImageDetail ImageDetailTitle": {
        "position": "relative",
        "zIndex": 1000,
        "fontSize": 12,
        "backgroundColor": "rgb(227, 169, 159)",
        "textAlign": "left",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10
    },
    "Thumnails": {
        "flexDirection": "column",
        "backgroundColor": "rgba(200, 200, 200, 1)"
    },
    "Thumnails thumbnails_block": {
        "backgroundColor": "rgba(220, 220, 220, 1)",
        "border": "0px dotted #dfd",
        "height": "100%"
    },
    "Thumnails thumbnails_blockover": {
        "backgroundColor": "rgba(190, 190, 190, 0.8)",
        "border": "2px dotted #dfd"
    },
    "thumbnail_block": {
        "display": "flex",
        "flexDirection": "column",
        "backgroundColor": "green",
        "border": "1px solid #fdd",
        "width": 150,
        "cursor": "pointer",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "contain",
        "backgroundPosition": "center"
    },
    "thumbnail_blockover": {
        "backgroundColor": "rgba(24, 129, 12, 0.8)",
        "width": 148,
        "border": "2px dotted #dfd"
    },
    "thumbnail_block div": {
        "display": "flex",
        "height": "auto",
        "marginTop": "auto",
        "marginRight": "auto",
        "marginBottom": "auto",
        "marginLeft": "auto"
    },
    "thumbnail_text": {
        "display": "block",
        "backgroundColor": "blue",
        "border": "1px solid #fdd",
        "fontSize": 0.5
    },
    "image_detail_block": {
        "position": "relative",
        "top": -10,
        "left": -30
    },
    "ProgressBar": {
        "top": 0,
        "left": 0,
        "position": "fixed",
        "width": "100%",
        "height": "100%",
        "backgroundColor": "rgba(118, 118, 118, 0.80)",
        "zIndex": 1001,
        "display": "none"
    },
    "Preview": {
        "top": 0,
        "left": 0,
        "position": "fixed",
        "width": "100%",
        "height": "100%",
        "backgroundColor": "rgba(118, 118, 118, 0.80)",
        "zIndex": 1001,
        "display": "none"
    },
    "ProgressBar>div": {
        "position": "fixed",
        "top": "50%",
        "left": "5%",
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto",
        "width": "90%",
        "height": 7,
        "backgroundColor": "rgba(238, 118, 238, 1)",
        "zIndex": 1000,
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10
    },
    "ProgressBar>div progeressTitle": {
        "paddingBottom": 5
    },
    "ProgressBar>div progeressFrame": {
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto",
        "width": "95%",
        "height": 3,
        "backgroundColor": "rgb(193, 165, 200)",
        "zIndex": 1000,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "ProgressBar>div progeressInfo": {
        "paddingTop": 5
    },
    "ProgressBar>div progeressInfo>div": {
        "width": "70%",
        "float": "left"
    },
    "ProgressBar>div progeressInfo>divprogeressPoints": {
        "width": 5
    },
    "progeress": {
        "position": "relative",
        "top": 0,
        "left": 0,
        "height": 3,
        "backgroundColor": "rgb(120, 231, 194)"
    },
    "Preview>div": {
        "position": "fixed",
        "top": "2%",
        "left": "2%",
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto",
        "width": "96%",
        "height": "96%",
        "backgroundColor": "rgb(197, 206, 213)",
        "zIndex": 1000,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "Preview>div img": {
        "maxWidth": "100%",
        "maxHeight": "100%"
    },
    "Preview>div previewLeft": {
        "cursor": "pointer",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "backgroundColor": "rgba(95, 161, 212, 0.58)"
    },
    "Preview>div previewRight": {
        "cursor": "pointer",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "backgroundColor": "rgba(95, 161, 212, 0.58)"
    },
    "Preview>div previewInfo": {
        "fontSize": "60%",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "color": "rgb(43, 176, 218)"
    },
    "Preview>div preview_dual": {
        "display": "flex"
    },
    "Preview>div preview_dual previewImageFrame": {
        "width": "50%"
    },
    "Preview>div preview_dual previewImageFramedummy": {
        "backgroundColor": "rgb(174, 181, 184)"
    },
    "TitleSettings": {
        "backgroundColor": "rgb(159, 117, 242)",
        "paddingTop": 0.1,
        "paddingRight": 0.1,
        "paddingBottom": 0.1,
        "paddingLeft": 0.1,
        "marginTop": 0.1,
        "marginRight": 0,
        "marginBottom": 0.1,
        "marginLeft": 0
    },
    "TitleSettingsTitle": {
        "paddingTop": 0.3,
        "paddingRight": 0.3,
        "paddingBottom": 0.3,
        "paddingLeft": 0.3,
        "marginBottom": 0.3,
        "fontWeight": "bold",
        "fontSize": "110%",
        "width": "100%",
        "textAlign": "center",
        "backgroundColor": "rgb(139, 87, 242)"
    },
    "TitleSettingsFrame": {
        "display": "flex"
    },
    "TitleSettingsFrame>div": {
        "width": "50%"
    },
    "TitleSettingsRow>span": {
        "display": "inline-flex",
        "width": "40%"
    },
    "TitleSettingsRow>input": {
        "display": "inline-flex",
        "width": "40%"
    },
    "TitleSettingsUpdate": {
        "width": "70%",
        "backgroundColor": "rgb(3, 21, 186)",
        "color": "white",
        "fontWeight": "bold",
        "textAlign": "center",
        "marginTop": 0.5,
        "marginRight": "auto",
        "marginBottom": 0.5,
        "marginLeft": "auto",
        "paddingTop": 0.5,
        "paddingRight": 0.5,
        "paddingBottom": 0.5,
        "paddingLeft": 0.5,
        "borderRadius": 1,
        "cursor": "pointer"
    },
    "previewFrame": {
        "display": "flex"
    },
    "previewFrame>divbutton": {
        "width": 2
    },
    "previewFrame>divbutton spanbutton": {
        "display": "block",
        "width": 20,
        "textAlign": "center"
    },
    "previewFrame>divbutton spanbuttonsymbol": {
        "fontSize": "150%"
    },
    "previewFrame>divbutton spanbuttontext": {
        "fontSize": "50%"
    },
    "previewCallButton": {
        "width": 150,
        "backgroundColor": "rgb(156, 111, 146)",
        "fontSize": "50%",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "marginTop": 1,
        "marginRight": 1,
        "marginBottom": 1,
        "marginLeft": 1,
        "cursor": "pointer",
        "borderRadius": 5
    },
    "pageFrameHeader": {
        "fontSize": "60%",
        "backgroundColor": "rgb(59, 2, 62)",
        "color": "white",
        "paddingTop": 5,
        "paddingRight": 5,
        "paddingBottom": 5,
        "paddingLeft": 5
    },
    "pageFrameHeaderLeft": {
        "textAlign": "left"
    },
    "pageFrameHeaderRight": {
        "textAlign": "right"
    },
    "PageFrame": {
        "display": "flex",
        "backgroundColor": "rgb(166, 121, 191)",
        "width": 300,
        "height": 150,
        "fontSize": 1,
        "marginTop": 0.1,
        "marginRight": "auto",
        "marginBottom": 0.1,
        "marginLeft": "auto",
        "paddingTop": 0.25,
        "paddingRight": 1,
        "paddingBottom": 0.25,
        "paddingLeft": 1
    },
    "PageFrame Page": {
        "width": 110,
        "border": "2px solid rgb(126, 100, 113)",
        "backgroundColor": "rgb(172, 148, 185)",
        "height": 140,
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto"
    },
    "PageFrame Dummy": {
        "backgroundColor": "rgb(106, 91, 115)"
    },
    "PageFrame Page thumbnail_block": {
        "height": 104,
        "width": 106,
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto",
        "backgroundColor": "rgb(227, 209, 238)"
    },
    "thumbnail_block image_block": {
        "height": 104,
        "width": 106,
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto",
        "backgroundColor": "rgb(227, 209, 238)",
        "cursor": "pointer",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "contain",
        "backgroundPosition": "center"
    },
    "MenuFrame": {
        "display": "flex"
    },
    "MenuFrame div": {
        "width": "20%",
        "cursor": "pointer",
        "paddingTop": 5,
        "paddingRight": 10,
        "paddingBottom": 5,
        "paddingLeft": 10,
        "marginTop": 2,
        "marginRight": 1,
        "marginBottom": 0,
        "marginLeft": 1,
        "border": "1px solid rgb(83, 122, 134)",
        "borderBottomWidth": 0,
        "borderTopLeftRadius": 10,
        "borderTopRightRadius": 10,
        "backgroundColor": "rgb(170, 185, 210)",
        "color": "rgb(222, 240, 222)"
    },
    "ExportArea ExportArea": {
        "backgroundColor": "rgb(195, 240, 204)",
        "border": "1px solid rgb(87, 158, 17)",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10
    },
    "ExportOrdrList ExportOrdersListTitle": {
        "backgroundColor": "rgb(162, 233, 176)",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "marginBottom": 0.3
    },
    "ExportOrdrList ExportOrdrListFrame": {
        "backgroundColor": "rgb(222, 232, 219)",
        "paddingTop": 15,
        "paddingRight": 15,
        "paddingBottom": 15,
        "paddingLeft": 15,
        "border": "1px solid rgb(87, 158, 17)",
        "marginBottom": 0.5
    },
    "ExportOrdrList ExportOrdrs": {
        "marginBottom": 0.5
    },
    "ExportButtons": {
        "display": "flex",
        "flexDirection": "row"
    },
    "divbutton>divexportedState": {
        "backgroundColor": "rgb(148, 222, 164)",
        "paddingTop": 0.2,
        "paddingRight": 0.2,
        "paddingBottom": 0.2,
        "paddingLeft": 0.2,
        "fontSize": "60%"
    },
    "ExportButtons>div": {
        "display": "flex",
        "width": 200,
        "paddingTop": 15,
        "paddingRight": 15,
        "paddingBottom": 15,
        "paddingLeft": 15,
        "marginTop": 2,
        "marginRight": 2,
        "marginBottom": 2,
        "marginLeft": 2,
        "border": "1px solid rgb(87, 158, 17)",
        "cursor": "pointer",
        "borderRadius": 3,
        "backgroundColor": "rgb(141, 233, 159)"
    },
    "divDownloadLastExportZipButtonFrame": {
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "divDownloadLastExportPdfButtonFrame": {
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "divbuttondisable": {
        "backgroundColor": "rgb(104, 131, 116)",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "divbuttonenable": {
        "backgroundColor": "rgb(148, 219, 86)",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "ExportArea ExportOrdrs>div": {
        "marginTop": 0.1,
        "marginRight": 0.1,
        "marginBottom": 0.1,
        "marginLeft": 0.1,
        "paddingTop": 0.4,
        "paddingRight": 0.4,
        "paddingBottom": 0.4,
        "paddingLeft": 2,
        "border": "1px solid #aaa",
        "cursor": "pointer",
        "backgroundColor": "rgb(232, 242, 229)"
    },
    "ExportArea ExportOrdrs>div:active": {
        "border": "1px solid #666",
        "backgroundColor": "rgb(242, 252, 239)"
    },
    "ExportArea ExportOrdrs>div:hover": {
        "border": "1px solid #999",
        "backgroundColor": "rgb(237, 247, 234)"
    },
    "ExportArea ExportOrdrs>divactive": {
        "fontWeight": "bold",
        "color": "rgb(223, 238, 218)",
        "backgroundColor": "rgb(70, 187, 35)"
    },
    "ExportArea ExportOrdrs>label": {
        "display": "inline-block",
        "lineHeight": 2,
        "marginTop": 0.1,
        "marginRight": 0.1,
        "marginBottom": 0.1,
        "marginLeft": 0.1,
        "paddingTop": 0.4,
        "paddingRight": 0.6,
        "paddingBottom": 0.4,
        "paddingLeft": 0.6,
        "border": "0px solid #aaa",
        "cursor": "pointer",
        "backgroundColor": "rgb(232, 242, 229)"
    },
    "ExportArea ExportOrdrs>label:active": {
        "backgroundColor": "rgb(174, 223, 160)"
    },
    "ExportArea ExportOrdrs>label:hover": {
        "backgroundColor": "rgb(237, 247, 234)"
    },
    "TitleMng": {
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "backgroundColor": "rgb(237, 247, 234)"
    },
    "display_none": {
        "display": "none"
    }
});