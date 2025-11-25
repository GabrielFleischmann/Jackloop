import { useState, useEffect } from "react";
import "./NavBar.css";
import Logo from "../assets/JackloopLogo.png";
import ModalLogin from "./ModalLogin";

export default function NavBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  function handleLoginSuccess(userData: any) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <>
      <div className="navbar">
        <img src={Logo} className="navbar-logo" />
        <div className="navbar-buttons">
          {user ? (
            <>
              <span className="user-badge">{user.email}</span>
              <button className="button-logout" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button
                className="button-login"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button className="button-registrer">Registre-se</button>
            </>
          )}
        </div>
      </div>

      <ModalLogin
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
