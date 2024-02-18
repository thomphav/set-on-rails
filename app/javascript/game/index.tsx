import React, { useEffect, useState } from "react";
import Board from "./board";
import Timer from "./timer";
import { game, gameCard } from "../common_types/types";
import { setCsrfToken } from '../utils';

interface GameProps {
  game: game;
  gameCards: gameCard[];
  initialGameOver: boolean;
  numOfCardsInDeck: number;
}

const Game = ({ game, gameCards, initialGameOver, numOfCardsInDeck }: GameProps) => {
  const [gameOver, setGameOver] = useState<boolean>(initialGameOver);

  return (
    <div className="flex flex-col w-full py-20 space-y-8">
      <Timer
        game={game}
        gameOver={gameOver}
      />
      <Board
        game={game}
        gameCards={gameCards}
        gameOver={gameOver}
        setGameOver={setGameOver}
        numOfCardsInDeck={numOfCardsInDeck}
      />
    </div>
  )
};

export default Game;