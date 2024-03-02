import React from 'react'
import { Player } from '../common_types/types'
import PlayerRow from '../components/shared/player_row'
import { PlayerRowParents } from '../components/shared/player_row'

const LeaderBoard = ({ leaderBoard, scorer }: { leaderBoard: Player[], scorer: number | null }) => (
  <div className='flex flex-col h-full w-full lg:w-[400px] lg:min-w-[400px] lg:max-w-[400px] border border-gray-300 rounded p-4 lg:p-6 space-y-4 lg:space-y-8'>
    <h2 className='text-xl lg:text-3xl'>Leaderboard</h2>
    <div className="flex flex-col space-y-2 p-2">
      {leaderBoard?.map((player: Player, index: number) => (
        <PlayerRow
          key={player.id}
          parent={PlayerRowParents.LeaderBoard}
          player={player}
          index={index}
          scorer={scorer}
        />
      ))}
    </div>
  </div>
)

export default LeaderBoard