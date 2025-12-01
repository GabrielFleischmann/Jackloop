import "./ExtraGame.css";
import React, { useState, useEffect } from "react";
import api from "../../src/services/api";

export default function ExtraGame() {
  const [valor, setValor] = useState(250);
  const [secreto, setSecreto] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
      }
    }
  }, []);

  useEffect(() => {
    const numero = Math.floor(Math.random() * 500) + 1;
    /*pra nóis, ver número no console (dps vai ser removido) */
    console.log("Número secreto inicial:", numero);
    setSecreto(numero);
  }, []);

  function apostar() {
    if (valor === secreto) {
      setMensagem("Você acertou!!!!!");

      if (user && user.id) {
        api.post('/coins/transactions/', {
          user: user.id,
          amount: 100,
          transaction_type: 'win',
          description: 'Ganhou no jogo de adivinhação'
        })
          .then(() => {
            window.dispatchEvent(new Event('balanceUpdated'));
          })
          .catch((error: any) => {
            console.error("Erro ao adicionar moedas:", error);
          });
      }
    } else {
      setMensagem(`Você errou! O número era ${secreto}`);
    }
    const novo = Math.floor(Math.random() * 500) + 1;
    /*pra nóis, ver número no console (dps vai ser removido) */
    console.log("Novo número secreto:", novo);
    setSecreto(novo);
  }

  return (
    <>
      <div className="caixaJogo">
        <div><h1>Jogo de advinhação</h1></div>
        <div><h2>Escolha um número entre 1 e 500</h2></div>
        <div className="caixaInput">
          <p style={{ color: "white", marginBottom: 10 }}>
            Número escolhido: <strong>{valor}</strong>
          </p>
          <input
            type="range"
            min="1"
            max="500"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
          />
        </div>
        <div><button className="botaoApostar" onClick={apostar}>Apostar</button></div>
        <div className="mensagem"><p>{mensagem}</p></div>

        <div>
          <button className="botaoInfo" onClick={() => setMostrarInfo(true)}>!</button>
          {mostrarInfo && (
            <div className="fundoEscurecido">
              <div className="janelaAviso">
                <h1 style={{ marginTop: "0px", fontSize: "22px" }}>Como funciona?</h1>
                <p>
                  Escolha um número entre 1 e 500 movendo a barrinha.<br /><br />
                  Clique em "Apostar" para tentar adivinhar.<br /><br />
                  Se você acertar o número secreto, ganhará 100 moedas!
                  Se errar, não se preocupe, poderá tentar novamente com um novo número secreto.
                </p>
                <button onClick={() => setMostrarInfo(false)}>Fechar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}