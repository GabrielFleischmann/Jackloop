// CSS e React
import { Routes, Route } from 'react-router-dom';
import './App.css'

// Componentes
import CustomDrawerContent from './components/CustomDrawerContent'
import NavBar from './components/NavBar'

// Telas
import GamesPage from '../navigation/screens/GamesPage';
import AboutPage from '../navigation/screens/AboutPage';
import MainGame from '../navigation/screens/MainGame';
import ExtraGame from '../navigation/screens/ExtraGame';

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <CustomDrawerContent />

      <div className="main-area">
        <Routes>
          <Route path="/" element={<GamesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/main-game" element={<MainGame/>} />
          <Route path="/extra-game" element={<ExtraGame/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App
