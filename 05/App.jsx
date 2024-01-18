import React from "./core/React.js";

let showBar = false
function Counter() {
  // const foo = <div>foo</div>
  function Foo() {
    return <div>foo</div>
  }
  const bar = <p>bar</p>

  const foo = (
    <div>
      foo
      <div>child·1</div>
      <div>child·2</div>
    </div>
  )
  const bar2 = <div>bar</div>

  function handleShowBar() {
    showBar = !showBar
    React.update()
  }

  return (
    <div>
      Counter1
      {/* <dir>{showBar ? bar : foo}</dir> */}
      <dir>{showBar ? bar : <Foo></Foo>}</dir>
      <button onClick={handleShowBar}>showBar</button>
      Counter2
      <button onClick={handleShowBar}>showBar</button>
      <dir>{showBar ? bar2 : foo}</dir>
    </div>
  );
}

function App() {
  return (
    <div>
      app-V8
      <Counter></Counter>
    </div>
  )
}

export default App
