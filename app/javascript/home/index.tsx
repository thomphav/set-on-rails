import React, { useState, useEffect } from "react";
import { CsrfInput } from "../components/shared/csrf_input";
import { game } from "../common_types/types";
import { timeSince } from "../utils";
import useCable from "../hooks/use_cable";

enum RECEIVER_ACTIONS {
  add = 'add',
  update = 'update',
  remove = 'remove'
}

interface LobbyChannelData {
  action: string
  game?: game
  games?: game[]
}

const Home = ({ initialGames }: { initialGames: game[] }) => {
  const [games, setGames] = useState<game[]>(initialGames);

  const onReceived = (data: LobbyChannelData) => {
  if (data.action === RECEIVER_ACTIONS.add && data.game) setGames((prevGames: game[]) => [data.game, ...prevGames])
  if (data.action === RECEIVER_ACTIONS.remove && data.game) setGames((prevGames: game[]) => prevGames.filter((game: game) => game.id !== data.game.id))
  }

  useCable({ channel: 'ApplicationCable::LobbyChannel' }, onReceived);

  return (
    <>
      <div className="flex w-full h-full items-center px-36 py-24 space-x-48">
        <div className="flex w-1/3 h-full items-center justify-center">
          <form className="flex flex-col justify-center items-center mx-auto space-y-16" action="/games" method="post">
            <h1 className="text-6xl">Let's play Set!</h1>
            <CsrfInput />
            <button className="border border-gray-300 py-4 px-28 w-fit text-3xl rounded-md hover:bg-gray-50" type="submit">New Game</button>
          </form>
        </div>
        <div className="flex justify-center w-2/3 h-full">
          <div className="flex flex-col space-y-3 h-full w-full items-center border border-gray-300 rounded p-3">
            {games.map((game: game) => (
              <a key={game.id} href={`/games/${game.id}/room`} className="border border-gray-300 rounded w-full py-6 flex justify-center items-center hover:bg-gray-100">
                Created {timeSince(game.created_at)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
};

export default Home;