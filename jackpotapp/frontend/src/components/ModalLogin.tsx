import React, { useState, useRef, useEffect } from "react";
import "./ModalLogin.css";
import Logo from "../assets/JackloopLogo.png";

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function ModalLogin({
  isOpen,
  onClose,
  onLoginSuccess,
}: ModalLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      emailRef.current?.focus();
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
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        // resposta não-JSON
      }
      if (res.ok && data?.user) {
        onLoginSuccess(data.user);
        setEmail("");
        setPassword("");
        onClose();
      } else {
        setError(data?.detail || data?.error || `Erro ${res.status}`);
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
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
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <img src={Logo} alt="Jackloop Logo" className="modal-logo" />
        </div>
        <h2 id="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <label>
            Email
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <div className="login-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
