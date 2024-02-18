import React, { useState, useEffect } from "react";
import { SvgDefs } from "./svg_defs";
import { setCsrfToken } from "../utils";
import { game, gameCard } from "../common_types/types";
import useCable from '../hooks/use_cable';

interface BoardProps {
  game: game;
  gameCards: gameCard[];
  gameOver: boolean;
  numOfCardsInDeck: number;
  setGameOver: (gameOver: boolean) => void;
}

interface checkForSetResponse {
  result: boolean;
  new_cards: gameCard[];
  three_cards: gameCard[];
  game_over: boolean;
  num_of_cards_in_deck: number;
}

const Board = ({ game, gameCards, gameOver, numOfCardsInDeck, setGameOver }: BoardProps) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [cards, setCards] = useState<gameCard[]>(gameCards)
  const [numCardsInDeck, setNumCardsInDeck] = useState<number>(numOfCardsInDeck)
  const [notASet, setNotASet] = useState<boolean>(false);
  const [isASet, setIsASet] = useState<boolean>(false);

  const handleSelect = (id: number) => {
    if (selected.find((sid) => sid === id)) {
      setSelected((prevSelected) => prevSelected.filter((psid) => psid !== id));
    } else {
      setSelected((prevSelected) => [...prevSelected, id]);
    }
  };
    
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

  interface GameCardProps {
    gameCard: gameCard;
    handleSelect: (id: number) => void;
    selected: number[];
    gameOver: boolean;
  }

  const GameCard = ({ gameCard, handleSelect, selected, gameOver }: GameCardProps) => (
    <button
      key={gameCard.id}
      onClick={() => handleSelect(gameCard.id)}
      disabled={gameOver}
      className={
                  `flex justify-center items-center border-2 rounded-md w-[250px] h-[150px]
                  ${notASet && selected.find((id) => id === gameCard.id) && "border-4 border-red-500 transition-colors duration-500"}
                  ${isASet && selected.find((id) => id === gameCard.id) && "border-4 border-green-500 transition-colors duration-500"}
                  ${selected.find((id) => id === gameCard.id) && "border-4 border-blue-500"}
                  ${!gameOver && "hover:bg-gray-100"}`
                }
    >
      {Array.from({ length: gameCard.formatted_number }).map((_, index) => (
        <svg key={index} width="50" height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400">
          <use
            href={`#${gameCard.symbol}`}
            fill={gameCard.shading === "open" ? "transparent" : gameCard.shading === "striped" ? "blue" : gameCard.color}
            // mask={gameCard.shading === "striped" ? "url(#mask-stripe)" : ""}
          />
          <use href={`#${gameCard.symbol}`} stroke={gameCard.color} fill="none" strokeWidth={18} />
        </svg>
      ))}
    </button>
  )

  const onReceived = (data: checkForSetResponse) => {
    console.debug("ON RECEIVED", data)

    if (data.game_over) {
      setGameOver(true);
    }

    if (data.result) {
      setIsASet(true);

      const timeout = setTimeout(() => {
        setCards(data.new_cards)
        setNumCardsInDeck(data.num_of_cards_in_deck)
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
    if (selected.length === 3) {
      handleSubmit();
    }
  }, [selected]);

  useCable({ channel: 'ApplicationCable::GameChannel', game_id: game.id }, onReceived);

  return (
    <div className="flex flex-col items-center space-y-8">
      <SvgDefs />
      {gameOver && <h2 className="mx-auto text-3xl">Game Over</h2>}
      <div className="mx-auto grid grid-cols-3 gap-4">
        {cards.map((gameCard: gameCard) => (
          <GameCard
            key={gameCard.id}
            gameCard={gameCard}
            handleSelect={handleSelect}
            selected={selected}
            gameOver={gameOver}
          />
        ))}
      </div>
      <h2>{numCardsInDeck} card{numCardsInDeck === 1 ? "" : "s"} in the deck</h2>
    </div>
  );
};

export default Board;