import React, { useEffect, useState } from "react";
import Board from "./board";
import Timer from "./timer";
import { game, gameCard } from "./types";

const Game = ({ game, gameCards, initialGameOver }: { game: game, gameCards: gameCard[], initialGameOver: boolean}) => (
  <div className="flex flex-col w-full py-32 space-y-16">
    <Timer game={game} />
    <Board game={game} gameCards={gameCards} initialGameOver={initialGameOver}/>
  </div>
);

export default Game;