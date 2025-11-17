import "./CustomDrawerContent.css";
import { Link } from "react-router-dom";
import JackpotIcon from "../assets/Icons/jackpotIcon.svg"
import InfoIcon from "../assets/Icons/infoIcon.svg"

export default function CustomDrawerContent() {
  return (
    <>
      <div className="sidebar">
        <nav className="sidebar-menu">
          {/* Item 1: Lista de Jogos */}
          <Link to="/" className="sidebar-item">
            <img src={JackpotIcon} alt="Caça-Níqueis" className="sidebar-icon" />
            <p>Lista de jogos</p>
          </Link>
          
          {/* Item 2: Sobre Nós */}
          <Link to="/sobre" className="sidebar-item bottom-item">
            <img src={InfoIcon} alt="Informações" className="sidebar-icon" />
            <p>Sobre nós</p>
          </Link>
        </nav>
      </div>
    </>
  );
}
