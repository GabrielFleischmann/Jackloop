import "./Game.css";

export default function Game() {
  return (
    <>
     <div className="thumbnail-shape">
        <div className="thumnail-image">
          <img src="caminho/da/imagem.jpg" alt="Thumbnail do jogo"></img>
        </div>

        <div className="thumbnail-line"></div>
       
        <button className="game-button">JOGAR</button>
     </div>
    </>
  );
}