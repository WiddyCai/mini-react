# mini-react
### 01
##### 1）目标：在页面中呈现 app
##### 目的：理解 vdom 是如何转化成 dom 的

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

##### 2）目标：使用jsx
##### 实现：借助 vite 实现 jsx 的解析

### 02
##### 1）目标：实现任务调度器
##### 目的：学会使用requestIdleCallback进行分帧运算
##### 原理：根据IdleDeadline.timeRemaining()返回的数字进行渲染操作，时间不够则划分到下一个任务（task）再执行
##### 2）目标：实现 fiber 架构
##### 目的：理解 fiber 原理，并实现一个简易的 fiber
##### 3）目标：实现 统一提交功能
##### 目的：避免浏览器无空闲时间，导致只更新部分视图，然后将渲染节点统一提交

### 03
##### 1）目标：实现 function component
##### 目的：学会使用requestIdleCallback进行分帧运算
##### 解决思路：把 fc 当做一个盒子
##### 实现：
 * 1、type 的处理
 * 2、区分 fc 和 非 fc
 * 3、添加到视图的处理

### 04
##### 1）目标：实现绑定事件
##### 实现：在 updateProps 中识别 on 事件，并添加对应事件。
##### 2）目标：更新 props
##### 目的：理解 dom 树是如何进行 diff 的

### 05
##### 1）目标：diff 更新 children
##### 实现：将需要删除的节点放入deletions数组中，后续统一删除。
##### 2）目标：diff 删除多余的老节点
##### 实现：reconcilChildren循环完children之后如果还有oldFiber则说明还有多余的节点，将它加入到deletions数组中，后续统一删除。
##### 3）目标：解 edge case 的方式
##### 实现：1.有child时才赋值newFiber；2.有newFiber时，才赋值prevChild

### 06
##### 1）目标：实现 useState
##### 实现：使用stateHooks存储，使用stateHookIndex指向。
##### 2）目标：批量执行 action
##### 实现：通过queue收集，当使用useState时，然后批量调用 action。
##### 3）目标：优化
##### 实现：先 action 一下 stateHook.state，如果值相同，直接 return。

### 07
##### 1）目标：实现 useEffect
##### 实现：使用effectHooks存储，使用 commitEffectHooks 去调用对应hook里的callback。
