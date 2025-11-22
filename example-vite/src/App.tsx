import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import BasicEditor from './pages/BasicEditor'
import CustomMode from './pages/CustomMode'
import WithAssets from './pages/WithAssets'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <div className="nav-container">
            <h1 className="nav-title">Visual Editor Examples</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Basic Editor</Link>
              <Link to="/custom-mode" className="nav-link">Custom Mode</Link>
              <Link to="/with-assets" className="nav-link">With Assets</Link>
            </div>
          </div>
        </nav>
        
        <main className="main">
          <Routes>
            <Route path="/" element={<BasicEditor />} />
            <Route path="/custom-mode" element={<CustomMode />} />
            <Route path="/with-assets" element={<WithAssets />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
