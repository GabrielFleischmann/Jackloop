import React, { useState } from "react";
import "./MainGame.css";

export default function MainGame() {
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowLogin(false);
      } else {
        setError(data.detail || "Dados inválidos");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="main-game-root">
        <header className="main-header">
          <h1>Jogo Principal</h1>
          {user ? <div className="user-badge">{user.username}</div> : null}
          <button className="open-login" onClick={() => setShowLogin(true)}>
            Entrar
          </button>
        </header>

        <main className="main-content">
          {/* Conteúdo do jogo aqui */}
          <p>Bem-vindo ao Jackpot!</p>
        </main>

        {showLogin && (
          <div className="login-overlay" role="dialog" aria-modal="true">
            <div className="login-modal">
              <h2>Login</h2>
              <form onSubmit={handleLogin} className="login-form">
                <label>
                  Usuário
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Senha
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    onClick={() => setShowLogin(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}