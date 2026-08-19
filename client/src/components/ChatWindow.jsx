import React from 'react'
import ChatHeader from './ChatHeader.jsx'

function ChatWindow() {
  return (
    <>
    <div className='flex-1 flex-col h-screen bg-[#0b0d17]'>
    <ChatHeader />
    <div className="overflow-y-auto flex-1">ChatWindow</div>
    </div>

  </>
  )
}

export default ChatWindow