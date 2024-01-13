// V1 写死dom，直接插入到root中
// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector("#root").appendChild(dom)
// const textNode = document.createTextNode('')
// textNode.nodeValue = "appV1"
// dom.append(textNode)

// V2 理解原理，抽离共性
// 原理: react → vdom → js object
// 共性: type props children
// const textEl = {
//   type: 'TEXT_ELEMENT',
//   props: {
//     nodeValue: 'appV2',
//     children: []
//   }
// }
// const el = {
//   type: 'div',
//   props: {
//     id: 'app',
//     children: [textEl],
//   }
// }
// const dom = document.createElement(el.type)
// dom.id = el.props.id
// document.querySelector("#root").appendChild(dom)
// const textNode = document.createTextNode('')
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)

// V3 动态创建虚拟dom + 创建dom节点
// function createTextNode(text) {
//   return {
//     type: 'TEXT_ELEMENT',
//     props: {
//       nodeValue: text,
//       children: []
//     }
//   }
// }
// function createElement(type, props, ...children) {
//   return {
//     type,
//     props: {
//       ...props,
//       children: children.map((child) => { // V3.5
//         return typeof child === "string" ? createTextNode(child) : child
//       }),
//     }
//   }
// }
/**
 * render 需做事项
 * 1、创建 dom
 * 2、赋值 props 里的内容到 dom 上
 * 3、将 dom append 到对应的容器里
 * @param {*} el 
 * @param {*} container 
 */
// function render(el, container) {
//   const dom = 
//     el.type === 'TEXT_ELEMENT' 
//       ? document.createTextNode("") 
//       : document.createElement(el.type)
//   Object.keys(el.props).forEach(prop => {
//     if (prop !== "children") {
//       dom[prop] = el.props[prop]
//     }
//   })
//   el.props.children.forEach(child => {
//     render(child, dom)
//   })
//   container.append(dom)
// }
// const App = createElement('div', {id:"app"}, "appV3.5", "-mini-react")
// render(App, document.querySelector("#root"))


// V4 代码拆分，API统一
// core/React.js
// core/ReactDom.js
// ReactDOM: { createRoot: { render() } }
// const ReactDOM = {
//   createRoot(container) {
//     return {
//       render(App) {
//         render(App, container)
//       }
//     }
//   }
// }
import ReactDOM from "./core/ReactDom.js"
import App from "./App.js"

ReactDOM.createRoot(document.querySelector("#root")).render(App)
