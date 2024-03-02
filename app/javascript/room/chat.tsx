import React from 'react'
import { Message } from '../common_types/types';

const Chat = ({ messages, handleSend }: { messages: Message[], handleSend: (e: React.FormEvent<HTMLFormElement>) => void }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend(e);
  }

  return (
    <div className='flex h-full border border-gray-300 w-full min-h-[400px] lg:w-[400px] lg:min-w-[400px] lg:max-w-[400px] rounded p-4 lg:p-6 '>
      <div className='flex flex-col h-full w-full space-y-8'>
        <h2 className='text-xl sm:text-2xl lg:text-3xl'>Chat</h2>
        <div className='flex flex-col h-full w-full justify-end'>
          <div id="scrollableContainer" className='flex flex-col h-full w-full max-h-[500px] overflow-y-scroll'>
            {messages.map((message, index) => (
              <div key={index} className='w-full py-1'>
                <span className='break-words font-bold inline'>{message.account_username}</span>
                <span className='break-words inline'>: {message.message}</span>
              </div>
            ))}
          </div>

          <form className='flex space-x-4' onSubmit={(e) => handleSubmit(e)}>
            <input name="message" className='border w-full p-2'/>
            <button
              type="submit"
              className="border-2 border-gray-500 bg-gray-500 hover:border-gray-400 hover:bg-gray-400 text-sm sm:text-base text-white rounded p-2 w-[120px]"
            >
                Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat