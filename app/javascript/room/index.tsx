import React, { useEffect, useState } from 'react'
import useCable from '../hooks/use_cable';
import { game, RoomPlayer } from '../common_types/types';
import { setCsrfToken } from '../utils';

interface Message {
  account_id: number;
  account_email: string;
  account_username: string;
  message: string;
  sent_at: string;
}

const Room = ({ currentAccountId, game, chat }: { currentAccountId: number, game: game, chat: Message[] }) => {
  const [room, setRoom] = useState<RoomPlayer[]>([]);
  const [messages, setMessages] = useState<Message[]>(chat);

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

  const onRoomReceived = (data: any) => {
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
  }, onRoomReceived);

  const onChatReceived = (data: Message) => {
    setMessages((prevMessages) => [...prevMessages, data])
  }

  useCable({
    channel: 'ApplicationCable::GameChatChannel',
    game_id: game.id,
    current_account_id: currentAccountId
  }, onChatReceived);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const token = setCsrfToken();
      const formData = new FormData(e.currentTarget);
      const message = formData.get('message');

      fetch(`/internal_api/games/${game.id}/chats`, {
        method: 'POST',
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ message: message })
      })

      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const scrollableContainer = document.getElementById('scrollableContainer');
    if (scrollableContainer) scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
  }, [messages]);

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
                    <span>{player.username}</span>
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
            <div className='flex flex-col h-full w-full justify-end'>
              <div id="scrollableContainer" className='flex flex-col h-full w-full max-h-[500px] overflow-y-scroll'>
                {messages.map((message, index) => (
                  <div key={index} className='w-full py-1'>
                    <span className='break-words font-bold inline'>{message.account_username}</span>
                    <span className='break-words inline'>: {message.message}</span>
                  </div>
                ))}
              </div>

              <form className='flex space-x-4' onSubmit={(e) => handleSend(e)}>
                <input name="message" className='border w-full p-2'/>
                <button type="submit" className="border-2 border-gray-500 bg-gray-500 hover:border-gray-400 hover:bg-gray-400 text-white rounded p-2 w-[120px]">Send</button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Room