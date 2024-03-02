import React, { useEffect, useState } from 'react'
import useCable from '../hooks/use_cable';
import { game, RoomPlayer, Message } from '../common_types/types';
import { setCsrfToken } from '../utils';
import Chat from './chat';
import PlayersContainer from './players_container';

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
      <div className="flex flex-col overflow-y-scroll lg:flex-row w-full h-full items-center px-8 py-8 sm:px-16 sm:py-26 space-y-8 space-x-0 lg:space-x-16 lg:space-y-0">
        <PlayersContainer room={room} handleStart={handleStart}/>
        <Chat messages={messages} handleSend={handleSend}/>
      </div>
    </>
  )
}

export default Room