import React from "./core/React.js";

function Counter({ num }) {
  return <div>count: {num}</div>;
}

function CounterContainer({ num }) {
  return <Counter num={num}></Counter>
}

function App() {
  return (
    <div>
      app-V6.5-JSX
      <Counter num={10}></Counter>
      <CounterContainer num={20}></CounterContainer>
    </div>
  )
}

export default App
