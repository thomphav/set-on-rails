import React from 'react'
import { gameCard } from '../common_types/types'

interface GameCardProps {
  gameCard: gameCard;
  handleSelect: (id: number) => void;
  selected: number[];
  gameOver: boolean;
  isASet: boolean;
  notASet: boolean;
  frozen: boolean;
}

const GameCard = ({ gameCard, handleSelect, selected, gameOver, isASet, notASet, frozen }: GameCardProps) => (
  <button
    onClick={() => handleSelect(gameCard.id)}
    disabled={frozen || selected.length === 3 || gameOver}
    className={
                `flex justify-center items-center border-2 rounded-md w-[90px] h-[60px] min-[420px]:w-[120px] min-[420px]:h-[80px] lg:w-[150px] lg:h-[100px]
                ${notASet && selected.find((id) => id === gameCard.id) && "border-4 border-red-500 transition-colors duration-500"}
                ${isASet && selected.find((id) => id === gameCard.id) && "border-4 border-green-500 transition-colors duration-500"}
                ${selected.find((id) => id === gameCard.id) && "border-4 border-blue-500"}
                ${!gameOver && "hover:bg-gray-100"}`
              }
  >
    {Array.from({ length: gameCard.formatted_number }).map((_, index) => (
      <svg key={index} width="25%" height="70%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400">
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

export default GameCard