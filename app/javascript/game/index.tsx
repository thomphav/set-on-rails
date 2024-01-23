import React, { useEffect, useState } from "react";

interface gameCard {
  id: number
  color: string
  symbol: string
  shading: string
  formatted_number: number
}

const Game = ({ gameId, gameCards }: { gameId: number, gameCards: gameCard[]}) => {
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    if (selected.find((sid) => sid === id)) {
      setSelected((prevSelected) => prevSelected.filter((psid) => psid !== id));
    } else {
      setSelected((prevSelected) => [...prevSelected, id]);
    }
  };

  const setCsrfToken = () => {
    const metaTag = document.querySelector("meta[name=csrf-token]");
    if (metaTag instanceof HTMLMetaElement) {
      return metaTag ? metaTag.content : "no-csrf-token"
    }
    return "no-csrf-token"
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
        body: JSON.stringify({ game_id: gameId, ids: selected })
      })

      const data = await response.json();

      console.log(data)

      if (!data.result) setSelected([])
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if (selected.length === 3) {
      handleSubmit();
    }
  }, [selected]);

  return (
    <div className="flex w-full">
      <div className="mx-auto my-32 grid grid-cols-3 gap-4">
        <svg className="hidden" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path
              id="squiggle"
              d="m67.892902,12.746785c43.231313,-6.717223 107.352741,6.609823 121.028973,58.746408c13.676233,52.136585 -44.848649,161.467192 -45.07116,204.650732c4.566246,56.959708 83.805481,87.929227 22.329944,105.806022c-61.475536,17.876795 -126.122496,-1.855045 -143.73294,-41.933823c-17.610444,-40.07878 49.274638,-120.109409 46.14822,-188.091997c-3.126418,-67.982588 -21.873669,-70.257464 -49.613153,-80.177084c-27.739485,-9.919618 5.678801,-52.283035 48.910115,-59.000258z"
            />
            <path
              id="oval"
              d="m11.49999,95.866646c0,-44.557076 37.442923,-81.999998 82.000002,-81.999998l12.000015,0c44.557076,0 81.999992,37.442923 81.999992,81.999998l0,206.133354c0,44.557098 -37.442917,82 -81.999992,82l-12.000015,0c-44.557079,0 -82.000002,-37.442902 -82.000002,-82l0,-206.133354z"
            />
            <path
              id="diamond"
              d="m98.544521,10.311863l-87.830189,189.330815l88.201143,189.644391l88.942329,-190.362741l-89.313283,-188.612465z"
            />
            <pattern
              id="pattern-stripe"
              width="2"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <rect width="2" height="8" fill="blue"/>
            </pattern>
            <mask id="mask-stripe" x="0" y="0" width="100" height="100">
              <rect
                x="0"
                y="0"
                height="50"
                width="100"
                fill="white"
              />
            </mask>
          </defs>
        </svg>
        {gameCards.map((gameCard: gameCard) => (
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
        ))}
      </div>
    </div>
  );
};

export default Game;