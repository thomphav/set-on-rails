import React, { useState, useEffect } from "react";
import { SvgDefs } from "./svg_defs";
import { game, gameCard } from "../common_types/types";

interface BoardProps {
  cards: gameCard[];
  gameOver: boolean;
  numCardsInDeck: number;
  selected: number[];
  handleSelect: (id: number) => void;
  isASet: boolean;
  notASet: boolean;
}

const Board = ({
  cards,
  gameOver,
  numCardsInDeck,
  selected,
  handleSelect,
  isASet,
  notASet
}: BoardProps) => {
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
                  `flex justify-center items-center border-2 rounded-md w-[175px] h-[105px]
                  ${notASet && selected.find((id) => id === gameCard.id) && "border-4 border-red-500 transition-colors duration-500"}
                  ${isASet && selected.find((id) => id === gameCard.id) && "border-4 border-green-500 transition-colors duration-500"}
                  ${selected.find((id) => id === gameCard.id) && "border-4 border-blue-500"}
                  ${!gameOver && "hover:bg-gray-100"}`
                }
    >
      {Array.from({ length: gameCard.formatted_number }).map((_, index) => (
        <svg key={index} width="36" height="72" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400">
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