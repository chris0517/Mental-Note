import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Test from './components/Test'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Test />
      </div>
    </>
  )
}

export default App
