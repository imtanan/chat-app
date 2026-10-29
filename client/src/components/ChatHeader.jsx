
import { useState,useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {useSocket} from '../context/useSocket.js'

function ChatHeader({currentChat,user,setGroupInfo}) {
  const {onlineUsers,socket} = useSocket()
  const [typingUsers, setTypingUsers] = useState({})
const otherParticipant = currentChat?.participants.find(
    p => p._id !== user._id
  )
useEffect(()=>{
  if(!socket) return
  const onTyping = ({chatId,userId,username})=>{
    if (chatId !== currentChat?._id) return
  
        setTypingUsers((prev)=>({...prev,[userId]:username}))
      }
      
      
      const onStop=({chatId, userId})=>{
        if (chatId !== currentChat?._id) return
        setTypingUsers((prev)=>{
          const {[userId]: _, ...rest} =prev
          return rest
        })}
        
       
    
  



  socket.on('typing', onTyping)
  socket.on('stopTyping', onStop)
  return () => {
    socket.off('typing', onTyping)
    socket.off('stopTyping', onStop)
  }
},[socket,currentChat?._id])
useEffect(() => { setTypingUsers({}) }, [currentChat?._id])

const typers = Object.values(typingUsers)


let typingText=''
if(currentChat && typers.length>0) {
  if(!currentChat.isGroupChat) typingText="typing..."
  else if(typers.length ===1) typingText = `${typers[0]} is typing...`
  else if(typers.length ===2) typingText = `${typers[0]} and ${typers[1]} are typing...`
  else typingText='Several people are typing...'
}
const  isOnline = !currentChat?.isGroupChat && onlineUsers?.includes(otherParticipant?._id)
const avatarSrc = currentChat?.isGroupChat ? (currentChat.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentChat?.chatName}`) : otherParticipant?.avatar;
const displayName = currentChat?.isGroupChat ? currentChat?.chatName : otherParticipant?.username;
  return (
    <>
    {currentChat? (currentChat.isGroupChat?(<div className="flex items-center px-6 py-4 border-b border-[#1E2235] bg-[#111320]">
      <button className='flex items-center  gap-2.5 px-2 py-1 -mx-2 -my-1 hover:bg-[#181A28] rounded-lg transition-colors cursor-pointer' onClick={()=>setGroupInfo(true)}>
      <div className='relative'>
     <img src={avatarSrc} className='w-9 h-9 rounded-3xl' shrink-0 />
     {isOnline && <span className='absolute bottom-0 right-0  w-3 h-3 rounded-full bg-green-600 border-2 border-[#111320]'></span>}
     </div>
     <div className='flex flex-col mt-4'>
        <span className='text-white text-sm font-semibold'>{displayName}</span>
       { (typingText?(<p className='text-xs text-violet-400'>{typingText}</p>):( <p className={`text-xs  ${isOnline?'text-green-500':'text-gray-500' }`}>{`${currentChat.participants.length} members`}</p>))}
        </div>
        <ChevronDown className="w-4 h-4 text-[#6b7491] ml-2"/>
        </button>
        </div>):(
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#1E2235] bg-[#111320]">
     
      <div className='relative'>
     <img src={avatarSrc} className='w-9 h-9 rounded-3xl' shrink-0 />
     {isOnline && <span className='absolute bottom-0 right-0  w-3 h-3 rounded-full bg-green-600 border-2 border-[#111320]'></span>}
     </div>
     <div className='flex flex-col mt-4'>
        <span className='text-white text-sm font-semibold'>{displayName}</span>
       { (typingText?(<p className='text-xs text-violet-400'>{typingText}</p>): ( <p className={`text-xs  ${isOnline?'text-green-500':'text-gray-500' }`}>{ isOnline? "Active Now" : "Offline"}</p>))}
        </div>
        
        
        </div>
        )
      ):(<div className='flex items-center  gap-2.5 px-6 py-4 border-b border-[#1E2235] bg-[#111320] h-[73px]'> <span className="text-sm text-[#6b7491]">Select a chat to start messaging</span></div>)
      }
      </>
  )
}

export default ChatHeader