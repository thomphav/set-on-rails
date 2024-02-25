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
    if (selected.some((sid: number) => sid === id)) {
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
    <div className="flex w-full h-full px-36 py-24 space-x-16">

      <div className="flex flex-col w-2/3 justify-center space-y-8 h-full border border-gray-300 rounded">
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

      <div className='flex h-full w-1/3 border border-gray-300 rounded p-6'>
        <div className='flex flex-col h-full w-full space-y-8'>
          <h2 className='text-3xl'>Leaderboard</h2>
          <div className="flex flex-col space-y-2 p-2">
            {leaderBoard?.map((player: Player, index: number) => (
              <div key={player.id} className='flex space-x-2.5 w-full'>
                <div className='flex justify-center border border-gray-100 bg-gray-100 text-gray-500 rounded-md p-3 w-[50px]'>
                  {index + 1}
                </div>
                <div className="flex border border-gray-300 rounded-md p-3 w-full justify-between">
                  <span>{player.email}</span>
                  <span>{player.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
};

export default Game;