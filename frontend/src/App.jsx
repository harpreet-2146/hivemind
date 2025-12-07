import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="full-height">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
