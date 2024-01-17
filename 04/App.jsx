import React from "./core/React.js";

let count = 10
let props = {id: "1"}
function Counter({ num }) {
  function handleClick() {
    console.log('[ click ] >', 123)
    count++
    props = {}
    React.update()
  }
  return (
    <div {...props}>
      count: {count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function CounterContainer({ num }) {
  return <Counter num={num}></Counter>
}

function App() {
  return (
    <div>
      app-V7
      <Counter num={10}></Counter>
      {/* <CounterContainer num={20}></CounterContainer> */}
    </div>
  )
}

export default App
