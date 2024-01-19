import React from "./core/React.js";

function Foo() {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState("bar")
  function handleClick() {
    setCount((c) => c + 1)
    // setBar((s) => s + "bar")
    // setBar("barbar")
    // setBar("bar")
    setBar(() => "bar")
  }

  return (
    <div>
      <h1>foo</h1>
      <div>{count}</div>
      <div>{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  )
}

function App() {
  return (
    <div>
      app-V9
      <Foo></Foo>
    </div>
  )
}

export default App
