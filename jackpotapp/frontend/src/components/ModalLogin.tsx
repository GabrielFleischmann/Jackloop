import React, { useState, useEffect } from "react";
import "./ModalLogin.css";
import Logo from "../assets/JackloopLogo.png";
import api from "../services/api"; 

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onShowSignUp?: () => void;
}

export default function ModalLogin({
  isOpen,
  onClose,
  onShowSignUp,
  onLoginSuccess,
}: ModalLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
    } else {
      document.removeEventListener("keydown", onKey);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const loginData = {
      email: email,
      password: password
    };

      try {   
         const response = await api.post("/users/auth/", loginData);

        if (response.status === 200 && response.data.user) {
        onLoginSuccess(response.data.user);
        setEmail("");
        setPassword("");
        onClose();
        } else {
        setError(response.data.error || "Erro no login");
      }

      } catch (err: any) {
        setError(err.response?.data?.error || "Erro de conexão com o servidor");
     } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="login-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div className="login-modal custom-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <img src={Logo} alt="Jackloop Logo" className="modal-logo" />
        </div>
        <h2 id="login-title" className="custom-login-title">Login</h2>
        
        <form onSubmit={handleLogin} className="login-form custom-login-form">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="custom-input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            className="custom-input"
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary custom-btn-primary">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        
        <div className="custom-create-account">
          <a 
            href="#" 
            className="custom-link"
            onClick={(e) => {
              e.preventDefault();
              if (onShowSignUp) {
                onShowSignUp();
                onClose();
              }
            }}
          >
            Criar conta
          </a>
        </div>
        
        <div className="custom-warning">Este jogo é apenas recreativo e não envolve apostas reais.</div>
      </div>
    </div>
  );
}