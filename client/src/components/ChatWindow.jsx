import { useEffect, useState, useRef } from 'react'
import {useSocket} from  '../context/useSocket.js';
import ChatHeader from './ChatHeader.jsx'
import MessageInput from './MessageInput.jsx'
import api from '../api/axios.js'

function ChatWindow({ currentChat, user }) {
  const {socket, onlineUsers} = useSocket();
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)


  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const otherParticipant = currentChat?.participants.find(
    p => p._id !== user._id
  )

useEffect(() => {
  if (!currentChat) return
  api.get(`messages/get?chatId=${currentChat._id}`)
    .then(res => setMessages(res.data.data))
}, [currentChat])


  useEffect(() => {
    if (!currentChat || !socket) return
socket.emit('joinChat', currentChat?._id)
console.log('user joined', currentChat._id)
const handleNewMessage =(message)=>{
setMessages(prev =>[...prev, message])
}
socket.on('newMessage', handleNewMessage)
console.log("HANDLER", handleNewMessage)
     return () => socket.off('newMessage', handleNewMessage)
    
  }, [currentChat,socket])

  useEffect(()=>{
     bottomRef.current?.scrollIntoView({behavior:"smooth"})
  }, [messages])

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-[#0b0d17]">

        {/* Header */}
        <ChatHeader currentChat={currentChat} otherParticipant={otherParticipant} />

        {/* Messages */}
        <div className="overflow-y-auto flex-1 px-7 custom-scrollbar">

          {messages.map((message) => {
            const isOther =
              message?.sender?._id === otherParticipant?._id

            return (
              <div
                key={message?._id}
                className={`flex mb-8 ${
                  isOther ? "justify-start" : "justify-end"
                }`}
              >

                {/* Avatar + Message */}
                <div className="flex items-end gap-3">

                  {isOther && (
                    <img
                      src={otherParticipant?.avatar}
                      className="w-9 h-9 rounded-full shrink-0"
                    />
                  )}

                  {/* Bubble + Time */}
                  <div>

                    <div
                      className={`rounded-xl px-5 py-3 border ${
                        isOther
                          ? "bg-[#181a28] border-[#24283b]"
                          : "bg-[#7837e6] border-[#7837e6]"
                      }`}
                    >
                      <p className="text-white">
                        {message.content}
                      </p>
                    </div>

                    <span className="block text-xs text-[#566080] mt-1 px-1">
                      {formatTime(message?.createdAt)}
                    </span>

                  </div>

                </div>

              </div>
            )
          })}
      <div ref={bottomRef} />
        </div>

        {/* Input */}
        <MessageInput currentChat={currentChat}  />

      </div>
    </>
  )
}

export default ChatWindow