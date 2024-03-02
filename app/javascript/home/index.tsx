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
      <div className="flex flex-col lg:flex-row w-full h-full items-start lg:items-center px-8 py-8 sm:px-16 sm:py-16 space-x-0 space-y-16 sm:space-y-8 lg:space-x-24 lg:space-y-0">
        <div className="flex h-fit lg:h-full items-center justify-center w-full lg:w-[380px] lg:max-w-[380px] lg:min-w-[380px]">
          <form className="flex flex-col sm:flex-row lg:flex-col w-full justify-between lg:justify-center items-center mx-auto space-y-8 space-x-0 sm:space-y-0 sm:space-x-16 lg:space-y-16 lg:space-x-0" action="/games" method="post">
            <h1 className="text-3xl lg:text-4xl">
              <span className="text-purple-600">9</span> Players Online
            </h1>
            <CsrfInput />
            <button className="border border-gray-300 py-4 px-6 w-full max-w-[200px] lg:max-w-full text-base lg:text-xl rounded-md hover:bg-gray-50" type="submit">Create New Game</button>
          </form>
        </div>
        <div className="flex justify-center w-full h-full">
          <div className="flex flex-col space-y-2 h-full w-full items-center border border-gray-200 rounded p-2 overflow-y-scroll">
            {games.length === 0 ?
              <div className="flex h-full items-center">
                <p className="text-base sm:text-lg">No games are live at the moment</p>
              </div>
            :
              games.map((game: game) => (
                <a
                  key={game.id} href={`/games/${game.id}/room`}
                  className="border border-gray-200 rounded w-full p-4 flex items-center hover:bg-gray-100 justify-between"
                >
                  <span className="text-sm sm:text-base">Players: {game.room_count}</span>
                  <span className="text-sm sm:text-base">Created {timeSince(game.created_at)}</span>
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