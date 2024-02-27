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
    <div className="flex flex-col w-full h-full p-24">
      <div className="flex flex-col border border-gray-300 rounded h-full p-6 space-y-8">
        <h1 className="text-3xl">Dashboard</h1>
        <div className="flex">
          <div className="border border-gray-300 grid grid-cols-4 gap-16 rounded">
            <div className="p-2 font-bold col-span-1">Game ID</div>
            <div className="p-2 font-bold col-span-1"># Players</div>
            <div className="p-2 font-bold col-span-1">Time</div>
            <div className="p-2 font-bold col-span-1">Won</div>
            {games.map((game) => (
              <>
                <div className="bg-white p-2 col-span-1 flex items-center">{game.id}</div>
                <div className="bg-white p-2 col-span-1 flex items-center">{game?.players?.length}</div>
                <div className="bg-white p-2 col-span-1 flex items-center">{formatDuration(game.start_time, game.end_time)}</div>
                <div className="bg-white p-2 col-span-1 flex items-center">Yes</div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard