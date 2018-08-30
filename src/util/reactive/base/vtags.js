import {
  patch,
  h
} from './preLoader'
export class V {
  static div() {}
}
const setProps = (data, inputs) => {
  let newData = {};
  if (data && typeof data === "object") {
    if (!data.props) {
      data.props = {};
    }
    newData = data;
  } else {
    newData = {
      props: {}
    };
  }
  for (let key in inputs) {
    newData.props[key] = inputs[key];
  }
  return newData;
}
const vtags = (tagName, id, classNames, data = {}, children, text) => {
  const id1 = tagName + (
    id && typeof id === "string" ?
    "#" + id :
    "");
  const id2 = id1 + (
    classNames ?
    (Array.isArray(classNames) && classNames.length > 0 && typeof classNames[0] === "string") ?
    "." + classNames.join(".") :
    (
      (Array.isArray(id) && id.length > 0 && typeof id[0] === "string") ?
      "." + id.join(".") :
      '') :
    "");
  const childrenArray = children && Array.isArray(children) ?
    children :
    (
      data && Array.isArray(data) ?
      data :
      (
        Array.isArray(classNames) && classNames.length > 0 && typeof classNames[0] === "object" ?
        classNames :
        []));
  const currentText = text ?
    text :
    (
      children && typeof children === "string" ?
      children :
      data && typeof data === "string" ?
      data

      :
      classNames && typeof classNames === "string" ?
      classNames :
      "");
  let currentData = typeof data === "string" || Array.isArray(data) ?
    {} :
    data;
  if (children !== undefined && text === undefined && classNames && !Array.isArray(classNames) && typeof classNames === "object") {
    currentData = classNames;
  } else if (children === undefined && text === undefined && id && !Array.isArray(id) && typeof id === "object") {
    currentData = id;
  }
  const toString = Object.prototype.toString
  //console.log("●id2:" + id2 + "/" + typeof currentData + "/currentData:" + currentData + "/toString:" + toString.call(currentData)+"/children:"+childrenArray+"/"+Array.isArray(childrenArray)+"/text:"+currentText);
  const childNode = childrenArray.length > 0 ?
    childrenArray :
    currentText;
  const newVnode = h(id2, currentData, childNode);
  //console.log(newVnode);
  return newVnode;
}
//a div span img ul li input label
export const a = (id, classNames, href, data, children) => {
  return vtags("a", id, classNames, setProps(data, {
    href: href
  }), children, null);
}
export const div = (id, classNames, data, children, text) => {
  return vtags("div", id, classNames, data, children, text);
}

export const span = (id, classNames, data, children, text) => {
  return vtags("span", id, classNames, data, children, text);
}

export const img = (id, classNames, alt, src, data) => {
  return vtags("img", id, classNames, setProps(data, {
    alt: alt,
    src: src
  }), null, null);
}

export const ul = (id, classNames, data, children, text) => {
  return vtags("ul", id, classNames, data, children, text);
}

export const li = (id, classNames, data, children, text) => {
  return vtags("li", id, classNames, data, children, text);
}

export const file = (id, classNames, data, value, text) => {
  return vtags("input", id, classNames, setProps(data, {
    type: "file"
  }), null, text);
}
export const input = (id, classNames, data, type, text) => {
  return vtags("input", id, classNames, setProps(data, {
    type: type,
    value: text
  }), null, text);
}
export const checkbox = (id, classNames, data, text) => {
  return vtags("input", id, classNames, setProps(data, {
    type: "checkbox",
    value: text
  }), null, text);
}
export const label = (id, classNames, data, children, text) => {
  return vtags("label", id, classNames, data, children, text);
}
export const select = (id, classNames, data, children, text) => {
  return vtags("select", id, classNames, data, children, text);
}
export const option = (id, classNames, data, children, text) => {
  return vtags("option", id, classNames, data, children, text);
}

export const createSelectVnode = (id, classes, name, optionsData, selectedValue, on, suffix = "") => {
  const options = [];
  const isArray = Array.isArray(optionsData);
  for (let key in optionsData) {
    const text = optionsData[key];
    // alert("selectedValue:" + selectedValue + "/key:" + key + "/" + (        selectedValue === key))
    if ((!isArray && key === selectedValue) || (isArray && text + "" === selectedValue + "")) {
      //console.log("★　matched　selectedValue:"+selectedValue+"/text:"+text)
      const optionSelected = option("", [""], {
        attrs: {
          value: isArray ?
            text :
            key,
          selected: "true"
        }
      }, text + suffix);
      options.push(optionSelected);
    } else {
      const optionNode = option("", [""], {
        attrs: {
          value: isArray ?
            text :
            key
        }
      }, text + suffix);
      options.push(optionNode);
    }
  }
  const data = {
    props: {
      name: name
    }
  }
  if(on){
    data.on = on
  }
  return select(id, classes, data, options);
}
