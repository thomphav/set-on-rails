import React, { useState, useEffect } from "react";
import { CsrfInput } from "../components/shared/csrf_input";
import { game } from "../common_types/types";
import { timeSince } from "../utils";
import useCable from "../hooks/use_cable";

enum RECEIVER_ACTIONS {
  add = 'add',
  addAll = 'add_all',
  update = 'update',
  remove = 'remove'
}

interface LobbyChannelData {
  action: string
  game?: game
  games?: game[]
}

const Home = () => {
  const [games, setGames] = useState<game[]>([]);

  const onReceived = (data: LobbyChannelData) => {
  if (data.action === RECEIVER_ACTIONS.add && data.game) setGames((prevGames: game[]) => [data.game, ...prevGames])
  if (data.action === RECEIVER_ACTIONS.addAll && data.games) setGames(data.games)
  if (data.action === RECEIVER_ACTIONS.remove && data.game) setGames((prevGames: game[]) => prevGames.filter((game: game) => game.id !== data.game.id))
  }

  useCable({ channel: 'ApplicationCable::LobbyChannel' }, onReceived);

  return (
    <>
      <div className="flex w-full h-full items-center py-24">
        <div className="flex w-1/2 h-full items-center">
          <form className="flex flex-col justify-center items-center mx-auto space-y-16" action="/games" method="post">
            <h1 className="text-6xl">Let's play Set!</h1>
            <CsrfInput />
            <button className="border border-gray-800 py-4 px-28 w-fit text-4xl rounded-md hover:bg-gray-50" type="submit">New Game</button>
          </form>
        </div>
        <div className="flex justify-center w-1/2 h-full pr-24">
          <div className="flex flex-col space-y-4 h-full w-full items-center border border-gray-400 rounded p-4">
            {games.map((game: game) => (
              <a key={game.id} href={`/games/${game.id}/room`} className="border border-gray-400 rounded w-full py-8 flex justify-center items-center hover:bg-gray-100">
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