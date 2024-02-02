import React from 'react'
import { game } from '../common_types/types'

const Dashboard = ({ games }: { games: game[] }) => {
  const formatDuration = (start_time: number, end_time: number) => {
    const duration = (end_time - start_time)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds}`
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col border p-4">
        <h1 className="text-3xl">Dashboard</h1>
      </div>

      <div className="flex p-4">
        <div className="border border-gray-400 grid grid-cols-2 bg-gray-400 gap-px">
          <div className="bg-white p-2 font-bold col-span-1">Game ID</div>
          <div className="bg-white p-2 font-bold col-span-1">Time</div>
          {games.map((game) => (
            <>
              <div className="bg-white p-2 col-span-1 flex items-center">{game.id}</div>
              <div className="bg-white p-2 col-span-1 flex items-center">{formatDuration(game.start_time, game.end_time)}</div>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard