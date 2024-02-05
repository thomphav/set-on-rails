import React, { useEffect, useState } from "react";
import Board from "./board";
import Timer from "./timer";
import { game, gameCard } from "../common_types/types";
import { setCsrfToken } from './utils';

interface GameProps {
  game: game;
  gameCards: gameCard[];
  initialGameOver: boolean;
  numOfCardsInDeck: number;
}

const Game = ({ game, gameCards, initialGameOver, numOfCardsInDeck }: GameProps) => {
  const [gameOver, setGameOver] = useState<boolean>(initialGameOver);

  const handleGameOver = async () => {
    const token = setCsrfToken();

    try {
      await fetch(`/internal_api/games/${game.id}`, {
        method: 'PATCH',
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ end_time: Date.now() })
      });
      // so... not exactly accurate in terms of stopping the timer ui at the same time we update the db with the end time
      // but it's fine for now
      setGameOver(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col w-full py-32 space-y-16">
      <Timer
        game={game}
        gameOver={gameOver}
      />
      <Board
        game={game}
        gameCards={gameCards}
        gameOver={gameOver}
        setGameOver={setGameOver}
        handleGameOver={handleGameOver}
        numOfCardsInDeck={numOfCardsInDeck}
      />
    </div>
  )
};

export default Game;