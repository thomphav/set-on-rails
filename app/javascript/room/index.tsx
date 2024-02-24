import React, { useState } from 'react'
import useCable from '../hooks/use_cable';
import { game, RoomPlayer } from '../common_types/types';
import { setCsrfToken } from '../utils';

const Room = ({ currentAccountId, game }: { currentAccountId: number, game: game }) => {
  const [room, setRoom] = useState<RoomPlayer[]>([]);

  const handleStart = async () => {
    const token = setCsrfToken();
  
    try {
      await fetch(`/internal_api/games/start`, {
        method: 'POST',
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ game_id: game.id, account_id: currentAccountId })
      })
    } catch (error) {
      console.error(error);
    }
  };

  const onReceived = (data: any) => {
    if (data.action && data.action === 'start') {
      window.location.href = `/games/${game.id}`
      return
    }

    setRoom(data)
  }

  useCable({
    channel: 'ApplicationCable::GameRoomChannel',
    game_id: game.id,
    current_account_id: currentAccountId
  }, onReceived);

  return (
    <>
      <div className="flex w-full h-full items-center px-36 py-24 space-x-16">

        <div className='flex flex-col w-2/3 h-full border border-gray-300 rounded justify-between p-6'>
          <div className='flex flex-col h-full w-full space-y-8'>
            <h2 className='text-3xl'>Players</h2>
            <div className='flex flex-col space-y-4 w-full'>
              {room.map((player: RoomPlayer, index: number) => (
                <div key={player.id} className='flex space-x-2.5 w-full'>
                  <div className='flex justify-center border border-gray-100 bg-gray-100 text-gray-500 rounded-md p-3 w-[50px]'>
                    {index + 1}
                  </div>
                  <div className='flex border border-gray-300 rounded-md p-3 w-full'>
                    <span>{player.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="border-2 border-purple-500 bg-purple-500 hover:border-purple-400 hover:bg-purple-400 text-white rounded p-4" onClick={handleStart}>Start Game</button>
        </div>

        <div className='flex h-full w-1/3 border border-gray-300 rounded p-6'>
          <div className='flex flex-col h-full w-full space-y-8'>
            <h2 className='text-3xl'>Chat</h2>
            <div className='flex flex-col h-full justify-end'>
              <div className='flex flex-col h-full'>

              </div>

              <div className='flex space-x-2'>
                <input className='border w-full p-2'/>
                <button className="border-2 border-gray-500 bg-gray-500 hover:border-gray-400 hover:bg-gray-400 text-white rounded p-2 w-[120px]">Send</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Room