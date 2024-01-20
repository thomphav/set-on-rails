import React from "react";

const Game = ({ gameCards }: {gameCards: any}) => {

  return (
    <>
      <div>Woohoo!</div>
      {gameCards.map((gameCard: any) => (
        <div>
          <p>{gameCard.id}</p>
          <p>{gameCard.color}</p>
          <p>{gameCard.symbol}</p>
          <p>{gameCard.shading}</p>
          <p>{gameCard.number}</p>
        </div>
      ))}
    </>
  );
};

export default Game;