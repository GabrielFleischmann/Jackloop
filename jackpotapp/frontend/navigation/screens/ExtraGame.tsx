import "./ExtraGame.css";
import React, { useState, useEffect } from "react";

export default function ExtraGame() {
  const [valor, setValor] = useState(250);
  const [secreto, setSecreto] = useState(1);
  const [mensagem, setMensagem] = useState("");   

  useEffect(() => {
    const numero = Math.floor(Math.random() * 500) + 1;
    /*pra nóis, ver número no console (dps vai ser removido) */
    console.log("Número secreto inicial:", numero);
    setSecreto(numero);
  }, []);

  function apostar() {
    if (valor === secreto) {
      setMensagem("Você acertou!!!!!");
      /*dps coloca a lógica de ganhar moedas aqui, não é pra ter lógica de perder moedas nessa página */
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
        <div><button onClick={apostar}>Apostar</button></div>
        <div className="mensagem"><p>{mensagem}</p></div>
      </div>
    </>
  );
}