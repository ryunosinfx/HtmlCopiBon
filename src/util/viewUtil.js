export default class ViewUtil {
  constructor(){

  }
  static create(id,clasｓName){
    const div = document.createElement("div");
    div.className = clasｓName;
    div.id = id;
    return div;
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
