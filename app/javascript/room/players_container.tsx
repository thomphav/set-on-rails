import React from 'react';
import { RoomPlayer } from '../common_types/types';
import { PlayerRowParents } from '../components/shared/player_row';
import PlayerRow from '../components/shared/player_row';

const PlayersContainer = ({ room, handleStart }: { room: RoomPlayer[], handleStart: () => void }) => (
  <div className='flex flex-col w-full h-full min-h-[400px] border border-gray-300 rounded justify-between p-6'>
    <div className='flex flex-col h-full w-full space-y-8'>
      <h2 className='text-xl sm:text-2xl lg:text-3xl'>Players</h2>
      <div className='flex flex-col space-y-4 w-full'>
        {room.map((player: RoomPlayer, index: number) => (
          <PlayerRow key={player.id} parent={PlayerRowParents.RoomPlayersContainer} player={player} index={index}/>
        ))}
      </div>
    </div>
    <button className="border-2 border-purple-500 bg-purple-500 hover:border-purple-400 hover:bg-purple-400 text-white rounded p-3 lg:p-4" onClick={handleStart}>Start Game</button>
  </div>
)

export default PlayersContainer