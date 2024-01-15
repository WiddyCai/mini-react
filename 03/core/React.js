let root = null
let nextWorkOfUnit = null

/**
 * @param {*} el 
 * @param {*} container 
 */
function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }

  root = nextWorkOfUnit
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

    shouldYield = deadLine.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && root) {// V5.5
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function commitRoot() {
  commitWork(root.child)
  root = null
}

function commitWork(fiber) {
  if (!fiber) return

  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.dom) {
    fiberParent.parent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' 
  ? document.createTextNode("") 
  : document.createElement(type)
}

function updateProps(dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== "children") {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber, children) {
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }
    
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

function undateFunctionComponent(fiber) {
  // 3. 转换链表 设置好指针
  const children = [fiber.type(fiber.props)]

  initChildren(fiber, children)
}

function undateHostComponent(fiber) {
  // 1. 创建 dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    // 2. 处理 props
    updateProps(dom, fiber.props)
  }

  // 3. 转换链表 设置好指针
  const children = fiber.props.children
  initChildren(fiber, children)
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

const React = {
  render,
  createElement
}

export default React
