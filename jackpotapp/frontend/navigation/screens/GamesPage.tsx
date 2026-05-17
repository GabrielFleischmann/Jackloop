import "./GamesPage.css";
import Game from "../../src/components/Game";
import MainGameThumbnail from "../../src/assets/Thumbnails/MainGameThumbnail.svg"
import screen_gameExtra from "../../src/assets/Thumbnails/screen_gameExtra.svg"

export default function GamesPage() {
  return (
    <>
      <div className="title-container">
        <h1>Lista de Jogos</h1>
      </div>

       <div className="games-list">
        <Game image={MainGameThumbnail} route="/main-game" />
        <Game image={screen_gameExtra} route="/extra-game" />
      </div>
    </>
  );
}