import {useState} from 'react'
import api from '../api/axios.js'

function MessageInput({currentChat, setLatestFlag}) {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
   
    const sendMessage=async(e)=>{
    e.preventDefault()
    setLoading(true)
    try{
          console.log("1. SEND FUNCTION STARTED")
   await api.post("messages/send",{
      chatId:currentChat?._id,
      content:message,  
    })
   
  
    
    setMessage("")
   setLatestFlag(true)
  }catch(err){
    console.log(err)
  }finally{
    setLoading(false)
   
  }
    }
    const handleKeyDown=(e)=>{
      if(e.key ==="Enter" && !e.shiftKey){
        e.preventDefault()
        sendMessage(e)
      }

    }
  return (
    <div className='relative flex items-center w-full'>
        <textarea 
        disabled={loading}
        value={loading?"Loading":message? message: ""}
        onChange={(e)=>setMessage(e.target.value)}
        placeholder='Type a message...'
        rows={1}
        onKeyDown={handleKeyDown}
        className=' flex-1 resize-none bg-[#111320] border border-[#1E2235] rounded-xl px-4 py-3 text-white placeholder:text-[#6b7491] outline-none focus:border-violet-600 text-left'
        />
        <button className='right-3 top-1/2 -translate-y-1/2 absolute cursor-pointer disabled:cursor-not-allowed disabled:opacity-50' disabled={loading} onClick={sendMessage} >
        <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="w-5 h-5  focus:bg-violet-600"
>
  <path d="M22 2L11 13" />
  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
</svg>
</button>
        
        
    </div>
  )
}

export default MessageInput