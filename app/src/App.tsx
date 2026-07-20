import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PracticeSetup from './pages/PracticeSetup'
import PracticeSession from './pages/PracticeSession'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice/setup" element={<PracticeSetup />} />
        <Route path="/practice/session" element={<PracticeSession />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
