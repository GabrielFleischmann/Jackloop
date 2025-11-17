import "./NavBar.css";
import Logo from "../assets/JackloopLogo.png";

export default function NavBar() {
  return (
    <>
      <div className="navbar">
        <img src={Logo} className="navbar-logo" />
        <div className="navbar-buttons">
          <button className="button-login">Login</button>
          <button className="button-registrer">Registre-se</button>
        </div>
      </div>
    </>
  );
}
