import React, { useEffect, useState } from "react";
import Board from "./board";
import Timer from "./timer";
import { game, gameCard, Player } from "../common_types/types";
import { setCsrfToken } from '../utils';
import useCable from '../hooks/use_cable';

interface GameProps {
  game: game;
  gameCards: gameCard[];
  initialGameOver: boolean;
  numOfCardsInDeck: number;
  initialLeaderboard: Player[];
}

interface checkForSetResponse {
  result: boolean;
  new_cards: gameCard[];
  three_cards: gameCard[];
  game_over: boolean;
  num_of_cards_in_deck: number;
  leaderboard: Player[];
}

const Game = ({ game, gameCards, initialGameOver, numOfCardsInDeck, initialLeaderboard }: GameProps) => {
  const [gameOver, setGameOver] = useState<boolean>(initialGameOver);
  const [leaderBoard, setLeaderBoard] = useState<Player[]>(initialLeaderboard);
  const [selected, setSelected] = useState<number[]>([]);
  const [cards, setCards] = useState<gameCard[]>(gameCards)
  const [numCardsInDeck, setNumCardsInDeck] = useState<number>(numOfCardsInDeck)
  const [isASet, setIsASet] = useState<boolean>(false);
  const [notASet, setNotASet] = useState<boolean>(false);

  const handleSubmit = async () => {
    const token = setCsrfToken();
  
    try {
      await fetch(`/internal_api/games/check_for_set`, {
        method: 'POST',
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ game_id: game.id, ids: selected })
      })
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = (id: number) => {
    if (selected.find((sid: number) => sid === id)) {
      setSelected((prevSelected: number[]) => prevSelected.filter((psid: number) => psid !== id));
    } else {
      setSelected((prevSelected: number[]) => [...prevSelected, id]);
    }
  };

  const onReceived = (data: checkForSetResponse) => {
    if (data.game_over) {
      setGameOver(true);
    }

    if (data.result) {
      setIsASet(true);

      const timeout = setTimeout(() => {
        setCards(data.new_cards)
        setNumCardsInDeck(data.num_of_cards_in_deck)
        setLeaderBoard(data.leaderboard)
        setIsASet(false);
        setSelected([]);
      }, 300);

      return () => clearTimeout(timeout);
    } else {
      setNotASet(true);

      const timeout = setTimeout(() => {
        setNotASet(false);
        setSelected([]);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }

  useEffect(() => {
    if (selected.length === 3) handleSubmit();
  }, [selected]);

  useCable({ channel: 'ApplicationCable::GameChannel', game_id: game.id }, onReceived);

  return (
    <div className="flex w-full py-20">
      <div className="flex flex-col w-full space-y-8">
        <Timer
          game={game}
          gameOver={gameOver}
        />
        <Board
          cards={cards}
          gameOver={gameOver}
          numCardsInDeck={numCardsInDeck}
          selected={selected}
          handleSelect={handleSelect}
          isASet={isASet}
          notASet={notASet}
        />
      </div>
      <div className="w-[400px]">
        Leaderboard
        <div className="flex flex-col space-y-2 p-2">
          {leaderBoard?.map((player) => (
            <div key={player.id} className="flex border rounded p-2 justify-between">
              <span>{player.email}</span>
              <span>{player.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

export default Game;