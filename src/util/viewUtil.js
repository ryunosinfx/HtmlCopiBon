export default class ViewUtil {
  constructor(){

  }
  static create(id,clasｓName,text){
    return ViewUtil.ce("div",id,clasｓName,text);
  }
  static createInput(id,clasｓName,text){
    return ViewUtil.ce("input",id,clasｓName,text);
  }
  static createText(id,clasｓName,text){
    return ViewUtil.ce("text",id,clasｓName,text);
  }
  static createFile(id,clasｓName,text){
    return ViewUtil.ce("input",id,clasｓName,text,"file");
  }
  static createImage(id,clasｓName,text){
    return ViewUtil.ce("img",id,clasｓName,text);
  }
  static createUl(id,clasｓName,text){
    return ViewUtil.ce("ul",id,clasｓName,text);
  }
  static createLi(id,clasｓName,text){
    return ViewUtil.ce("li",id,clasｓName,text);
  }
  static createSpan(id,clasｓName,text){
    return ViewUtil.ce("span",id,clasｓName,text);
  }
  static createStrong(id,clasｓName,text){
    return ViewUtil.ce("strong",id,clasｓName,text);
  }
  static createA(id,clasｓName,text){
    return ViewUtil.ce("a",id,clasｓName,text);
  }
  static ce(tagName,id,clasｓName,text,type){
    const elm = document.createElement(tagName);
    elm.className = clasｓName;
    if(id){
      elm.id = id;
    }
    if(tagName==="input" && text){
      elm.setAttribute("value",text);
      if(type){
        elm.setAttribute("type",type);
      }
    } else if(text){
      elm.textContent = text;
    }
    return elm;
  }
  static on(elm,eventType,eventHandler){
    elm.addEventListener(eventType, eventHandler, false);
  }

  static append(parent,child){
    parent.appendChild(child);
  }
  static attachBody(elm){
    document.getElementsByTagName("body")[0].appendChild(elm);
  }
  static detacthBody(id){
    const child = documet.getElementById(id);
    document.getElementsByTagName("body")[0].removeChild(child);
  }
  static remove(id){
    const child = documet.getElementById(id);
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }
  }
  static removeChildren(id){
    const elm = documet.getElementById(id);
    while (elm.firstChild) {
      elm.removeChild(elm.firstChild);
    }
  }
  static text(elm,text){
    elm.textContent = text;
  }
}
