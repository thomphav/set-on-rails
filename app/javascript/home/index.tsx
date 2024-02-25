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
  game_id?: number
  game?: game
  games?: game[]
  room_count?: number
}

const Home = ({ initialGames }: { initialGames: game[] }) => {
  const [games, setGames] = useState<game[]>(initialGames);

  const onReceived = (data: LobbyChannelData) => {
    if (data.action === RECEIVER_ACTIONS.add && data.game) setGames((prevGames: game[]) => [data.game, ...prevGames])
    if (data.action === RECEIVER_ACTIONS.remove && data.game) setGames((prevGames: game[]) => prevGames.filter((game: game) => game.id !== data.game.id))

    console.log(data)
    if (data.game_id && data.room_count !== undefined) {
      setGames((prevGames: game[]) => prevGames.map((game: game) => {
        if (data.game_id && game.id === data.game_id) {
          return { ...game, room_count: data.room_count }
        }
        return game
      }))
    }
  }

  useCable({ channel: 'ApplicationCable::LobbyChannel' }, onReceived);

  return (
    <>
      <div className="flex w-full h-full items-center p-24 space-x-24">
        <div className="flex h-full items-center justify-center w-[320px] max-w-[380px] min-w-[380px]">
          <form className="flex flex-col justify-center items-center mx-auto space-y-16" action="/games" method="post">
            <h1 className="text-4xl">
              <span className="text-purple-600 font-medium">9</span> Players Online
            </h1>
            <CsrfInput />
            <button className="border border-gray-300 py-4 px-6 w-full text-xl rounded-md hover:bg-gray-50" type="submit">Create New Game</button>
          </form>
        </div>
        <div className="flex justify-center w-full h-full">
          <div className="flex flex-col space-y-2 h-full w-full items-center border border-gray-200 rounded p-2 overflow-y-scroll">
            {games.length === 0 ?
              <div className="flex h-full items-center">
                <p className="text-lg">No games are live at the moment</p>
              </div>
            :
              games.map((game: game) => (
                <a
                  key={game.id} href={`/games/${game.id}/room`}
                  className="border border-gray-200 rounded w-full p-4 flex items-center hover:bg-gray-100 justify-between"
                >
                  <span>Players: {game.room_count}</span>
                  <span>Created {timeSince(game.created_at)}</span>
                </a>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
};

export default Home;