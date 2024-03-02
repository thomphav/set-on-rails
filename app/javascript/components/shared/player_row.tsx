import React from 'react'
import { Player } from '../../common_types/types'

export enum PlayerRowParents {
  LeaderBoard = "LeaderBoard",
  RoomPlayersContainer = "RoomPlayersContainer"
}

const PlayerRow = ({ parent, player, index, scorer }: { parent: PlayerRowParents, player: Player, index: number, scorer?: number | null }) => (
  <div key={player.id} className='flex space-x-2.5 w-full'>
    <div className={`flex justify-center border border-gray-100 bg-gray-100 text-gray-500 rounded-md p-2 w-[40px] lg:p-3 lg:w-[50px] ${(scorer === player.id) ? "bg-green-200" : ""}`}>
      <span className='text-sm lg:text-base'>{index + 1}</span>
    </div>
    <div className={`flex border border-gray-300 rounded-md p-2 lg:p-3 w-full max-w-xs lg:max-w-full justify-between ${(scorer === player.id) ? "bg-green-200" : ""}`}>
      <span className='text-sm lg:text-base'>{player.username}</span>
      <span className='text-sm lg:text-base'>{player.score}</span>
    </div>
  </div>
)

export default PlayerRow