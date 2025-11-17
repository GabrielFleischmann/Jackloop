// CSS e React
import { Routes, Route } from 'react-router-dom'
import './App.css'

// Componentes
import CustomDrawerContent from './components/CustomDrawerContent'
import NavBar from './components/NavBar'

// Telas
import GamesPage from '../navigation/screens/GamesPage';
import AboutPage from '../navigation/screens/AboutPage';

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <CustomDrawerContent />

      <div className="main-area">
        <Routes>
          <Route path="/" element={<GamesPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>

    </div>
  );
}

export default App
