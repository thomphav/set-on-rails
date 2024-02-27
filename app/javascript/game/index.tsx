import React, { useEffect, useState } from "react";
import Board from "./board";
import Timer from "./timer";
import { game, gameCard, Player } from "../common_types/types";
import { setCsrfToken } from '../utils';
import useCable from '../hooks/use_cable';

interface GameProps {
  currentAccountId: number;
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
  scorer_id: number;
  end_time: number;
}

const Game = ({ currentAccountId, game, gameCards, initialGameOver, numOfCardsInDeck, initialLeaderboard }: GameProps) => {
  const [gameOver, setGameOver] = useState<boolean>(initialGameOver);
  const [leaderBoard, setLeaderBoard] = useState<Player[]>(initialLeaderboard);
  const [selected, setSelected] = useState<number[]>([]);
  const [cards, setCards] = useState<gameCard[]>(gameCards)
  const [numCardsInDeck, setNumCardsInDeck] = useState<number>(numOfCardsInDeck)
  const [isASet, setIsASet] = useState<boolean>(false);
  const [notASet, setNotASet] = useState<boolean>(false);
  const [frozen, setFrozen] = useState<boolean>(false);
  const [scorer, setScorer] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number>(game.end_time);
  const [gameOverModalOpen, setGameOverModalOpen] = useState<boolean>(gameOver);

  const handleSubmit = async () => {
    const token = setCsrfToken();
  
    try {
      // change any type...
      const response: Response = await fetch(`/internal_api/games/check_for_set`, {
        method: 'POST',
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ game_id: game.id, ids: selected })
      })

      const result: boolean = await response.json();

      // handle false response locally - no need to broadcast to others
      if (!result) {
        setFrozen(true);
        setNotASet(true);

        const timeout = setTimeout(() => {
          setNotASet(false);
          setSelected([]);
        }, 300);

        () => clearTimeout(timeout);

        setFrozen(false);
      }
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
    const {
      result,
      game_over,
      new_cards,
      num_of_cards_in_deck,
      scorer_id,
      leaderboard,
      end_time
    } = data;

    if (game_over) {
      setGameOver(true);
      setGameOverModalOpen(true);
    }
    if (end_time) setEndTime(end_time);

    if (result) {
      setFrozen(true);

      // if the user scored
      if (scorer_id === currentAccountId) {
        setIsASet(true);
        setScorer(scorer_id);

        const timeout = setTimeout(() => {
          setCards(new_cards)
          setNumCardsInDeck(num_of_cards_in_deck)
          setLeaderBoard(leaderboard)
          setIsASet(false);
          setSelected([]);
          setScorer(null);
        }, 300);

        () => clearTimeout(timeout);
      } else {
        setSelected([]);
        setScorer(scorer_id);

        const timeout = setTimeout(() => {
          setCards(new_cards)
          setNumCardsInDeck(num_of_cards_in_deck)
          setLeaderBoard(leaderboard)
          setScorer(null);
        }, 300);

        () => clearTimeout(timeout);
      }

      setFrozen(false);
    }
  }

  useEffect(() => {
    if (selected.length === 3) handleSubmit();
  }, [selected]);

  useCable({ channel: 'ApplicationCable::GameChannel', game_id: game.id }, onReceived);

  return (
    <div className="w-full h-full">
      {(gameOver && gameOverModalOpen) && (
        <div className="fixed flex justify-center items-center z-1 w-full h-full py-24" style={{ backgroundColor: 'rgba(10,10,10,0.5)' }}>
          <div className="flex flex-col items-center justify-between py-16 px-4 w-full max-w-lg mx-auto h-full max-h-[500px] bg-white rounded-md opacity-100 z-10 relative">
            <button className="absolute top-2 right-3 text-xl" onClick={() => setGameOverModalOpen(false)}>x</button>

            <div className="flex flex-col space-y-4 w-full items-center">
              <h2 className="mx-auto text-3xl">Game Over</h2>
              <span>Winner: <span className="font-medium">USERNAME</span></span>
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <button className="mx-auto p-3 bg-purple-500 text-white rounded-md w-full max-w-[250px] hover:bg-purple-600">Play again</button>
              <button className="mx-auto p-3 bg-gray-500 text-white rounded-md w-full max-w-[250px] hover:bg-gray-600">Back to lobby</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full h-full px-36 py-24 space-x-16">
        <div className="flex flex-col w-2/3 justify-center space-y-8 h-full border border-gray-300 rounded">
          <Timer
            game={game}
            gameOver={gameOver}
            endTime={endTime}
          />
          <Board
            cards={cards}
            gameOver={gameOver}
            numCardsInDeck={numCardsInDeck}
            selected={selected}
            handleSelect={handleSelect}
            isASet={isASet}
            notASet={notASet}
            frozen={frozen}
          />
        </div>
        <div className='flex h-full w-1/3 border border-gray-300 rounded p-6'>
          <div className='flex flex-col h-full w-full space-y-8'>
            <h2 className='text-3xl'>Leaderboard</h2>
            <div className="flex flex-col space-y-2 p-2">
              {leaderBoard?.map((player: Player, index: number) => (
                <div key={player.id} className='flex space-x-2.5 w-full'>
                  <div className={`flex justify-center border border-gray-100 bg-gray-100 text-gray-500 rounded-md p-3 w-[50px] ${(scorer === player.id) ? "bg-green-200" : ""}`}>
                    {index + 1}
                  </div>
                  <div className={`flex border border-gray-300 rounded-md p-3 w-full justify-between ${(scorer === player.id) ? "bg-green-200" : ""}`}>
                    <span>{player.username}</span>
                    <span>{player.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
};

export default Game;