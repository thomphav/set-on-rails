import React, { useState } from 'react'
import useCable from '../hooks/use_cable';
import { game, RoomPlayer } from '../common_types/types';

const Room = ({ game, initialRoom }: { game: game, initialRoom: RoomPlayer[] }) => {
  const [room, setRoom] = useState<RoomPlayer[]>(initialRoom);

  const onReceived = (data: any) => {
    setRoom(data)
  }

  useCable({ channel: 'ApplicationCable::GameRoomChannel', game_id: game.id }, onReceived);

  return (
    <div>
      <h2>Room Members:</h2>
      {room.map((player: RoomPlayer) => (
        <p key={player.id}>{player.id} {player.email}</p>
      ))}
    </div>
  )
}

export default Room