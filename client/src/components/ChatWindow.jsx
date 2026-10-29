import { useEffect, useState, useRef } from 'react'
import {useSocket} from  '../context/useSocket.js';
import ChatHeader from './ChatHeader.jsx'
import MessageInput from './MessageInput.jsx'
import api from '../api/axios.js'



function ChatWindow({ currentChat,setGroupInfo, user }) {
  const {socket, onlineUsers} = useSocket();
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)

const NAME_COLORS = [
  'text-sky-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400',
  'text-teal-400', 'text-orange-400', 'text-fuchsia-400', 'text-lime-400',
]

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const otherParticipant = currentChat?.participants.filter(
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

const handleNewMessage =(message)=>{
const chatId = message?.chat?._id ?? message?.chat

  if (chatId !== currentChat?._id) return
setMessages(prev =>[...prev, message])
}
socket.on('newMessage', handleNewMessage)

     return () => socket.off('newMessage', handleNewMessage)
    
  }, [currentChat,socket])

  useEffect(()=>{
     bottomRef.current?.scrollIntoView({behavior:"smooth"})
  }, [messages])

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-[#0b0d17]">

        {/* Header */}
        <ChatHeader currentChat={currentChat} user={user} setGroupInfo={setGroupInfo} />

        {/* Messages */}
        <div className="overflow-y-auto flex-1 px-7 custom-scrollbar">

          {messages.map((message) => {
            const isMine =
              message?.sender?._id === user?._id
const index = currentChat?.participants.findIndex((p)=>p._id === message?.sender._id)
const color = NAME_COLORS[index % NAME_COLORS.length]
            return (
              <div
                key={message?._id}
                className={`flex mb-8 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >

                {/* Avatar + Message */}
                <div className="flex items-end gap-3">

                  {!isMine && (
                    
                    <img
                      src={message?.sender?.avatar ||`https://api.dicebear.com/7.x/initials/svg?seed=${message?.sender?.username}`}
                      className="w-9 h-9 rounded-full shrink-0"
                    />
                  )}

                  {/* Bubble + Time */}
                  <div>

                    {!isMine &&(<p className={`text-xs flex items-center pb-1 font-semibold ${color}`}>{message?.sender?.username}</p>)}
                    <div
                      className={`rounded-xl px-5 py-2 border ${
                        isMine
                          ? "bg-[#7837e6] border-[#7837e6]":"bg-[#181a28] border-[#24283b]" 
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