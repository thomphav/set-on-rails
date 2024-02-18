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
    <div>
      <h2>Room Members:</h2>
      {room.map((player: RoomPlayer) => (
        <p key={player.id}>{player.id} {player.email}</p>
      ))}

      <button className="border p-4" onClick={handleStart}>Start Game</button>
    </div>
  )
}

export default Room