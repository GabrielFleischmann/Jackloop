import "./GamesPage.css";
import Game from "../../src/components/Game";
import MainGameThumbnail from "../../src/assets/Thumbnails/MainGameThumbnail.svg"

export default function GamesPage() {
  return (
    <>
      <div className="title-container">
        <h1>Lista de Jogos</h1>
      </div>

       <div className="games-list">
        <Game image={MainGameThumbnail} route="/main-game" />
        <Game image="/assets/thumb2.png" route="/extra-game" />
      </div>
    </>
  );
}