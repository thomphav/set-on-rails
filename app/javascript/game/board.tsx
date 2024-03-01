import React, { useState, useEffect } from "react";
import { SvgDefs } from "./svg_defs";
import { game, gameCard } from "../common_types/types";
import { keyCardMapping } from "./utils";
import GameCard from "./game_card";

interface BoardProps {
  cards: gameCard[];
  gameOver: boolean;
  numCardsInDeck: number;
  selected: number[];
  handleSelect: (id: number) => void;
  isASet: boolean;
  notASet: boolean;
  frozen: boolean;
}

const Board = ({
  cards,
  gameOver,
  numCardsInDeck,
  selected,
  handleSelect,
  isASet,
  notASet,
  frozen
}: BoardProps) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const cardsLength = cards.length;
      const cardIndex = keyCardMapping[event.key as keyof typeof keyCardMapping];

      if (cardIndex > cardsLength - 1) return;
      if (frozen || selected.length === 3 || gameOver) return;

      if (cardIndex !== undefined) handleSelect(cards[cardIndex].id);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected]);

  return (
    <div className="flex flex-col items-center">
      <SvgDefs />
      <div className="flex flex-col items-center space-y-8">
        <div className="mx-auto grid grid-cols-3 gap-2 min-[420px]:gap-3 lg:gap-4">
          {cards.map((gameCard: gameCard) => (
            <GameCard
              key={gameCard.id}
              gameCard={gameCard}
              handleSelect={handleSelect}
              selected={selected}
              gameOver={gameOver}
              isASet={isASet}
              notASet={notASet}
              frozen={frozen}
            />
          ))}
        </div>
        <p><span className="text-purple-600 font-medium">{numCardsInDeck}</span> card{numCardsInDeck === 1 ? "" : "s"} in the deck</p>
      </div>
    </div>
  );
};

export default Board;