import React from 'react'
import { Player } from '../common_types/types'

const LeaderBoard = ({ leaderBoard, scorer }: { leaderBoard: Player[], scorer: number | null }) => (
  <div className='flex flex-col h-full w-full lg:w-[400px] lg:min-w-[400px] lg:max-w-[400px] border border-gray-300 rounded p-4 lg:p-6 space-y-4 lg:space-y-8'>
    <h2 className='text-xl lg:text-3xl'>Leaderboard</h2>
    <div className="flex flex-col space-y-2 p-2">
      {leaderBoard?.map((player: Player, index: number) => (
        <div key={player.id} className='flex space-x-2.5 w-full'>
          <div className={`flex justify-center border border-gray-100 bg-gray-100 text-gray-500 rounded-md p-2 w-[40px] lg:p-3 lg:w-[50px] ${(scorer === player.id) ? "bg-green-200" : ""}`}>
            <span className='text-sm lg:text-base'>{index + 1}</span>
          </div>
          <div className={`flex border border-gray-300 rounded-md p-2 lg:p-3 w-full max-w-xs lg:max-w-full justify-between ${(scorer === player.id) ? "bg-green-200" : ""}`}>
            <span className='text-sm lg:text-base'>{player.username}</span>
            <span className='text-sm lg:text-base'>{player.score}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default LeaderBoard