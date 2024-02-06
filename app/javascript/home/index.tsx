import React from "react";
import { CsrfInput } from "../components/shared/csrf_input";
import { game } from "../common_types/types";
import { formatTimeFromMilliseconds } from "../utils";

const Home = ({ games }: { games: game[] }) => (
  <>
    {games ?
      <div className="flex w-full h-full items-center py-24">
        <div className="flex w-1/2 h-full items-center">
          <form className="flex flex-col justify-center items-center mx-auto space-y-16" action="/games" method="post">
            <h1 className="text-6xl">Let's play Set!</h1>
            <CsrfInput />
            <button className="border border-gray-800 py-4 px-28 w-fit text-4xl rounded-md hover:bg-gray-50" type="submit">New Game</button>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-4 w-1/2 h-full p-16">
          {games.map((game: game) => (
            <a key={game.id} href={`/games/${game.id}`} className="border border-gray-800 rounded-md flex justify-center items-center hover:bg-gray-100">
              Started {formatTimeFromMilliseconds(Date.now() - game.start_time)} ago
            </a>
          ))}
        </div>
      </div>
    :
      <div className="flex w-full h-full items-center">
        <form className="flex flex-col justify-center items-center mx-auto space-y-16" action="/games" method="post">
          <h1 className="text-6xl">Let's play Set!</h1>
          <CsrfInput />
          <button className="border border-gray-800 py-4 px-28 w-fit text-4xl rounded-md hover:bg-gray-50" type="submit">New Game</button>
        </form>
      </div>
    }
  </>
);

export default Home;