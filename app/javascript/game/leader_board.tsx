import React from 'react'
import { Player } from '../common_types/types'

const LeaderBoard = ({ leaderBoard, scorer }: { leaderBoard: Player[], scorer: number | null }) => (
  <div className='flex flex-col h-full w-full space-y-8'>
    <h2 className='text-3xl'>Leaderboard</h2>
    <div className="flex flex-col space-y-2 p-2">
      {leaderBoard?.map((player: Player, index: number) => (
        <div key={player.id} className='flex space-x-2.5 w-full'>
          <div className={`flex justify-center border border-gray-100 bg-gray-100 text-gray-500 rounded-md p-3 w-[50px] ${(scorer === player.id) ? "bg-green-200" : ""}`}>
            {index + 1}
          </div>
          <div className={`flex border border-gray-300 rounded-md p-3 w-full justify-between ${(scorer === player.id) ? "bg-green-200" : ""}`}>
            <span>{player.username}</span>
            <span>{player.score}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default LeaderBoard