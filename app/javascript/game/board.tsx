import React, { useState, useEffect } from "react";
import { SvgDefs } from "./svg_defs";
import { setCsrfToken } from "./utils";
import { game, gameCard } from "./types";

const Board = ({ game, gameCards, initialGameOver }: { game: game, gameCards: gameCard[], initialGameOver: boolean}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [cards, setCards] = useState<gameCard[]>(gameCards)
  const [gameOver, setGameOver] = useState<boolean>(initialGameOver)

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
      const response = await fetch(`/internal_api/games/check_for_set`, {
        method: 'POST',
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ game_id: game.id, ids: selected })
      })
  
      const data = await response.json();
  
      if (data.game_over) setGameOver(true)
      if (data.result) setCards(data.new_cards)
  
      setSelected([])
    } catch (error) {
      console.error(error)
    }
  };

  const GameCard = ({ gameCard, handleSelect, selected }: { gameCard: gameCard, handleSelect: (id: number) => void, selected: number[] }) => (
    <button
      key={gameCard.id}
      onClick={() => handleSelect(gameCard.id)}
      className={`flex justify-center items-center border-2 rounded-md w-[250px] h-[150px] hover:bg-gray-100
                  ${selected.find((id) => id === gameCard.id) && "border-blue-500"}`}
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

  useEffect(() => {
    if (selected.length === 3) {
      handleSubmit();
    }
  }, [selected]);

  return (
    <>
      <SvgDefs />
      {gameOver && <h2 className="mx-auto text-3xl">Game Over</h2>}
      <div className="mx-auto grid grid-cols-3 gap-4">
        {cards.map((gameCard: gameCard) => (
          <GameCard key={gameCard.id} gameCard={gameCard} handleSelect={handleSelect} selected={selected} />
        ))}
      </div>
    </>
  );
};

export default Board;