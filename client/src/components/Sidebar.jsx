import {useState,useRef,useEffect} from 'react'
import { Search, X } from 'lucide-react';
import api from '../api/axios.js'
function Sidebar({user,setUser,setCurrentChat,currentChat}) {
   const [loading, setLoading] = useState(false);
   const [searchLoading, setSearchLoading] = useState(false);
   const [results, setResults] = useState([]);
   const [error, setError] = useState('');
   const [chats, setChats]= useState([]);
    const [query, setQuery] = useState('');
    const[isSelected, setIsSelected] = useState(false);

    useEffect(()=>{
      api.get('chats/getUserChats').then(res=>setChats(res.data.data)).catch(err=>console.log(err))
    },[])


const otherParticipant = ((chat)=>
  chat.participants.find(p=>p._id !== user._id)
)


 const searchTimeout=useRef(null);
const handleInputChange = async(e) => {
 
  const value = e.target.value.trim();
  
  setQuery( value)
  clearTimeout(searchTimeout.current);
  
  searchTimeout.current = setTimeout(async()=>{
    setSearchLoading(true)
    try{
  const response = await api.get(`users/search?search=${value}`)
setResults(response.data.data)
}catch(err){
console.log(err)
}finally{
    setSearchLoading(false)
  }

},500)
  
}
   const handleSignOut=async(e)=>{
        e.preventDefault()
       setLoading(true)
       try{
       await api.post('users/logout')
       setUser(null);
       }catch(err){
        console.log(err)
       }finally{
        setLoading(false)
      }
       
    }
   
   
  return (
    <div className="w-[300px] shrink-0 h-screen bg-[#111320] border-r border-[#1E2235] flex flex-col">
 <div className="inline-flex items-center gap-1.5 mb-2">
  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white" />
    </svg>
  </div>
  <span className="font-outfit font-extrabold text-xl text-[#E4E6F0] tracking-[-0.02em]">
    PULSE<span className="text-violet-600">.</span>
  </span>
</div>

<div>
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7491] pointer-events-none" />

  <input
    type="text"
    placeholder="Search..."
    onChange={handleInputChange}
    value={query}
    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0d17] border border-[#1E2235] text-white text-sm placeholder:text-[#6b7491] outline-none focus:border-violet-600 transition-colors"
  />
  </div>

  {query && (results.length > 0 ? (
    <div className="mt-2 space-y-1">
      {results.map((user) => (
        <div
          key={user._id}
          className="flex items-center gap-2 rounded-lg hover:bg-[#111320] cursor-pointer"
        >
          <img
            src={user.avatar}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-white">
            {user.username}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <span className="text-sm text-white">
      No users found
    </span>
  )
  )}
</div>
{/* show chats lists that exists
give direct chat and group chat separately with a toggle
get their images and the username
make each chats clickable and clicking it must give setCurrentChat prop a chat */}
<div className="flex flex-col overflow-y-auto flex-1">
 {
  chats && chats.map((chat)=>{
  // condition 1 opening
  
  const participant=otherParticipant(chat);
   const avatarSrc = chat.isGroupChat ? `https://api.dicebear.com/7.x/initials/svg?seed=${chat.chatName}` : participant.avatar;
   const displayName = chat.isGroupChat ? chat.chatName : participant.username;
  return  (
    
  <button key={chat._id} onClick={()=>{setCurrentChat(chat); setIsSelected(true)}} className={`flex items-center gap-3 px-4 py-3 ${currentChat._id=== chat._id? "bg-[#181A28] rounded-lg outline outline-1 outline-[#7C3AED33]" : ""}  hover:bg-[#13151F] cursor-pointer transition-colors text-left`}>
  <img  src={avatarSrc}
            className="w-11 h-11 rounded-full shrink-0"
          />
          <div className="flex-1 min-w-0">
           <span className="text-sm text-white truncate block">
            {displayName}
          </span>
            <p className='text-xs text-[#6b7491] truncate '>{chat.latestMessage?.content || "No Message Yet"}</p>

          </div>
  </button>
  
)// condition 1 closing
  }//map bracket
  )//map closing
 }
</div>






<div className='mt-auto'>
  <button disabled={loading} onClick={handleSignOut} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium flex-col hover:bg-red-600">
        { loading? "Signing Out...":"Sign Out"}
        </button>
</div>
    </div>
  )
}


export default Sidebar