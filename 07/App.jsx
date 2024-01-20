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

  React.useEffect(() => {
    console.log('init')
    // clean up
    return () => {
      console.log("cleanup 0");
    }
  }, [])
  
  React.useEffect(() => {
    console.log('[ update ]', count)
    // clean up
    return () => {
      console.log("cleanup 1");
    }
  }, [count])

  React.useEffect(() => {
    console.log('[ update ]', count)
    // clean up
    return () => {
      console.log("cleanup 2");
    }
  }, [count])
  
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
      app-V10
      <Foo></Foo>
    </div>
  )
}

export default App
