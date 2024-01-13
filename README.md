# mini-react
### 01
##### 目标：在页面中呈现 app
##### 目的：理解 vdom 是如何转化成 dom 的
演变步骤：
V1 写死dom，直接插入到root中

V2 理解原理，抽离共性
 * 原理: react → vdom → js object
 * 共性: type props children

V3 动态创建虚拟dom + 创建dom节点
 * render函数需做事项
 * 1、创建 dom
 * 2、赋值 props 里的内容到 dom 上
 * 3、将 dom append 到对应的容器里

V4 代码拆分，API统一
