import { useState,useEffect } from 'react'
import Nav from './Nav/Nav'
import Background from './Background/Background'
import './App.css'
import Module from './Model/Module'



function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
  return (
    <>
      <Nav />
      <Background />
      <Module />

    </>
  )
}

export default App
