import "./Game.css";
import { Link } from "react-router-dom";

interface GameProps {
  image: string;
  route: string;
}

export default function Game({ image, route }: GameProps){
  return (
    <>
     <div className="thumbnail-shape">
        <div className="thumbnail-image">
          <img src={image} alt="Thumbnail do jogo"/>
        </div>
       
        <Link to={route}>
          <button className="game-button">JOGAR</button>
        </Link>

     </div>
    </>
  );
}