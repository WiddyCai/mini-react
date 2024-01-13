function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => { // V3.5
        return typeof child === "string" ? createTextNode(child) : child
      }),
    }
  }
}
/**
 * render 需做事项
 * 1、创建 dom
 * 2、赋值 props 里的内容到 dom 上
 * 3、将 dom append 到对应的容器里
 * @param {*} el 
 * @param {*} container 
 */
function render(el, container) {
  const dom = 
    el.type === 'TEXT_ELEMENT' 
      ? document.createTextNode("") 
      : document.createElement(el.type)
  Object.keys(el.props).forEach(prop => {
    if (prop !== "children") {
      dom[prop] = el.props[prop]
    }
  })
  el.props.children.forEach(child => {
    render(child, dom)
  })
  container.append(dom)
}

const React = {
  render,
  createElement
}

export default React
