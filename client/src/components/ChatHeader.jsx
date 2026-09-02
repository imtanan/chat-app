import {useEffect} from 'react'
import {useSocket} from '../context/useSocket.js'

function ChatHeader({currentChat,otherParticipant}) {
  const {onlineUsers} = useSocket()


const  isOnline = !currentChat?.isGroupChat && onlineUsers?.includes(otherParticipant?._id)
const avatarSrc = currentChat?.isGroupChat ? `https://api.dicebear.com/7.x/initials/svg?seed=${currentChat?.chatName}` : otherParticipant?.avatar;
const displayName = currentChat?.isGroupChat ? currentChat?.chatName : otherParticipant?.username;
  return (
    <>
    {currentChat?(<div className='flex items-center  gap-2.5 px-6 py-4 border-b border-[#1E2235] bg-[#111320]'>
      <div className='relative'>
     <img src={avatarSrc} className='w-9 h-9 rounded-3xl' shrink-0 />
     {isOnline && <span className='absolute bottom-0 right-0  w-3 h-3 rounded-full bg-green-600 border-2 border-[#111320]'></span>}
     </div>
     <div className='flex flex-col mt-4'>
        <span className='text-white text-sm font-semibold'>{displayName}</span>
         <p className={`text-xs  ${isOnline?'text-green-500':'text-gray-500' }`}>{currentChat?.isGroupChat ? `${currentChat.participants.length} members` : isOnline? "Active Now" : "Offline"}</p>
        </div>
        </div>):(<div className='flex items-center  gap-2.5 px-6 py-4 border-b border-[#1E2235] bg-[#111320] h-[73px]'> <span className="text-sm text-[#6b7491]">Select a chat to start messaging</span></div>)
      }
      </>
  )
}

export default ChatHeader