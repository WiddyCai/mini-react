let wipRoot = null
let currentRoot = null
let nextWorkOfUnit = null
let deletions = [] // 用来收集需要删除的节点
let wipFiber = null // 需要更新的节点

/**
 * @param {*} el 
 * @param {*} container 
 */
function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }

  nextWorkOfUnit = wipRoot
}

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
        const isTextNode = typeof child === "string" || typeof child === "number"
        return isTextNode ? createTextNode(child) : child
      }),
    }
  }
}

function workLoop(deadLine) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = undefined
    }

    shouldYield = deadLine.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && wipRoot) {// V5.5
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  commitEffectHooks()
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}

function commitEffectHooks() {
  function run(fiber) {
    if(!fiber) return;

    if (!fiber.alternate) {
      // init
      fiber.effectHooks?.forEach((hook) => {
        hook.cleanup = hook.callback()
      });
    } else {
      // update
      // deps 有没有变更
      fiber.effectHooks?.forEach((newHook, index) => {
        if (newHook.deps.length > 0) {
          const oldEffectHook = fiber.alternate?.effectHooks[index]
    
          const needUpdate = oldEffectHook?.deps.some((oldDep, i) => {
            return oldDep !== newHook.deps[i]
          })
    
          needUpdate && (newHook.cleanup = newHook?.callback())
        }
      });
    }

    run(fiber.child)
    run(fiber.sibling)
  }

  function runCleanup(fiber) {
    if(!fiber) return;

    fiber.alternate?.effectHooks?.forEach((hook) => {
      if (hook.deps.length > 0) {
        hook.cleanup && hook.cleanup()
      }
    })

    runCleanup(fiber.child)
    runCleanup(fiber.sibling)
  }

  runCleanup(wipRoot)
  run(wipRoot)
}

// 兼容 function component
function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child)
  }
}

function commitWork(fiber) {
  if (!fiber) return

  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' 
  ? document.createTextNode("") 
  : document.createElement(type)
}

function updateProps(dom, nextProps, prevProps) {
  // 1. old 有 new 无 删除
  Object.keys(prevProps).forEach(key => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  // 2. old 无 new 有 添加
  // 3. old 有 new 有 修改
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase()
          dom.removeEventListener(eventType, prevProps[key])
          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

function reconcilChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber
      }
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: "placement"
        }
      }
      // 将要删除的节点放到 deletions
      if (oldFiber) {
        deletions.push(oldFiber)
      }
    }

    if (oldFiber) { // 当有多个子节点时
      oldFiber = oldFiber.sibling
    }
    
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    if (newFiber) {
      prevChild = newFiber
    }
  })
  // 此时如果还有oldFiber，那么就是多余的，放进删除数组中
  while (oldFiber) {
    deletions.push(oldFiber)
    // 如果还有兄弟节点，就继续赋值，
    // 直到=undefined则说明已全部加入进删除数组
    oldFiber = oldFiber.sibling
  }
}

function undateFunctionComponent(fiber) {
  stateHooks = []
  stateHookIndex = 0
  effectHooks = []
  wipFiber = fiber
  // 3. 转换链表 设置好指针
  const children = [fiber.type(fiber.props)]

  reconcilChildren(fiber, children)
}

function undateHostComponent(fiber) {
  // 1. 创建 dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    // 2. 处理 props
    updateProps(dom, fiber.props, {})
  }

  // 3. 转换链表 设置好指针
  const children = fiber.props.children
  reconcilChildren(fiber, children)
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function"

  if (isFunctionComponent) {
    undateFunctionComponent(fiber)
  } else {
    undateHostComponent(fiber)
  }

  // 4. 返回下一个要执行的任务
  if(fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function update() {
  let currentFiber = wipFiber

  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }
  
    nextWorkOfUnit = wipRoot
  }
}

let stateHooks
let stateHookIndex
function useState(initial) {
  let currentFiber = wipFiber
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]
  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : []
  }

  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state)
  })

  stateHook.queue = []

  stateHookIndex++
  stateHooks.push(stateHook)

  currentFiber.stateHooks = stateHooks

  function setState(action) {
    const eagerState = typeof action === "function" ? action(stateHook.state) : action

    if (eagerState === stateHook.state) return;

    stateHook.queue.push(typeof action === "function" ? action : () => action)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }
  
    nextWorkOfUnit = wipRoot
  }
  return [stateHook.state, setState]
}

let effectHooks
function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
    cleanup: undefined
  }
  effectHooks.push(effectHook)

  wipFiber.effectHooks = effectHooks
}

const React = {
  render,
  update,
  useState,
  useEffect,
  createElement
}

export default React
