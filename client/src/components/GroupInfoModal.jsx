import {useState,useRef} from 'react'
import {Search,X} from 'lucide-react'
import api from '../api/axios.js'
function GroupInfoModal({user,setChats, currentChat,setCurrentChat,onClose}) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
const fileInputRef = useRef(null)
 const searchInputRef = useRef(null)
const participants = currentChat?.participants
const adminId = currentChat?.groupAdmin?._id
const iAmAdmin = adminId ===user?._id

const lists = results.filter((item)=> !participants.some((participant)=>participant._id === item._id))


  const avatarSrc = currentChat?.avatar? currentChat.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${currentChat.chatName}` 
  const updateAvatar = async(e) => {

e.preventDefault();
const file=e.target.files?.[0]
const formData = new FormData();

if(!file)return

try{
  formData.append('avatar', avatarFile)
  setAvatarFile(file)
  setAvatarPreview(URL.createObjectURL(file))
  await api.patch(`users/group-avatar/${currentChat._id}`,formData)
}catch(err){
 console.log('Error uploading file:', err)
    setError("Failed to upload file")
}

  }

const handleQuery = async(e)=>{
  e.preventDefault()
  const value = e.target.value.trim()
  setQuery(value)
  
  clearTimeout(searchInputRef.current)
  searchInputRef.current = setTimeout(async()=>{
 
  try{
    
     const response = await api.get(`users/search?search=${value}`)
     setResults(response.data.data)
    }catch(err){
      console.log('Error searching users:', err)
    }
  },500)
}

const addMember=async(user)=>{

  try{
    const response = await api.put(`chats/addToGroup/${currentChat._id}`,{userId:user._id})
    setCurrentChat(response.data.data)
  }catch(err){
      console.log('Error adding member:', err)
  }
}

  const handleRemove = async(participantId)=>{
    try{
      const response = await api.put(`chats/removeFromGroup/${currentChat._id}`, {userId: participantId})
     const updatedChat =response.data.data

     setCurrentChat(updatedChat)
     setChats((prev)=>prev.map((c)=>c._id ===updatedChat._id? updatedChat :  c))
    }catch(err){
      console.log('Error removing participant:', err)
    }
  }
  return (
    <div className="fixed flex items-center justify-center inset-0 z-50 backdrop-blur-sm bg-black/40" onClick={onClose}>
      <div className="  bg-[#0d0f1a] border border-[#1E2235] rounded-2xl w-full max-w-md mx-4 " onClick={(e)=>e.stopPropagation()}>
           <div className="flex items-center justify-between pb-3 px-6 pb-3 pt-6">
           <h2 className="font-bold text-white m-0 text-lg"> Group Info</h2>
           <button className="text-[#6b7491] hover:text-white" onClick={onClose}>
            <X  className='w-5 h-5' />
           </button>
           </div>

          <div className="flex flex-col items-center gap-2 ">
            <div className="border-2 border-violet-600 rounded-full"  onClick={() => fileInputRef.current?.click()}>
         <div className="w-28 h-28 rounded-full bg-[#0b0d17] border border-[#1E2235] flex items-center justify-center overflow-hidden cursor-pointer">
{avatarPreview ? (<img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />) : avatarSrc?(<img src={avatarSrc} alt='currentAvatar' className='w-full h-full object-cover'/>) : (<span className="text-[#6b7491] text-xs">No Photo</span>)}
 </div>
 </div>
 <input ref={fileInputRef} type="file" accept="image/*" onChange={updateAvatar} className="hidden" />
          <label className='text-sm text-violet-600 cursor-pointer' onClick={() => fileInputRef.current?.click()}>
            {avatarSrc ? 'Update Photo' : 'Upload Photo'}
          </label>
</div>
 
      <div className="px-6 py-5 space-y-4">
   <div>
            <label className='block text-[14px] text-start font-semibold text-[#6b7491] tracking-[0.08em] uppercase ml-1 mb-2'>Group Name</label>
           <input 
           value={currentChat.chatName} 
           className="w-full  px-[8px]  py-[11px] text-sm border border-[#1E2235] bg-[#0b0d17] rounded-[10px] text-white outline-none focus:border-violet-600"
           /> 
          </div>

          <div className="relative">
            <Search className='w-4 h-4  text-[#6b7491] pointer-events-none absolute left-3 top-1/2 -translate-y-1/2' />
            <input type="text" 
             placeholder="Search..."
             value={query}
             ref={searchInputRef}
             onChange={(e)=>handleQuery(e)}
              className='pl-10 pr-4 py-2.5 w-full text-sm px-[8px] py-[11px] text-white pl-10 border border-[#1E2235] bg-[#0b0d17] rounded-[10px] outline-none focus:border-violet-600'
              
              />
             {query && (
              
    <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-[#151a2e] rounded-[10px]  z-20 border border-violet-500/30  max-h-60 overflow-hidden shadow-xl shadow-black/50 space-y-4">
      {lists.length>0?(
        
      lists.map((user) => (
        <div
          key={user._id}
          onClick={()=>addMember(user)}
          className="flex items-center gap-2 rounded-lg hover:bg-[#111320] cursor-pointer"
        >
          
          <img
            src={user.avatar}
            className=" w-8 h-8 rounded-full"
          />
     
      
          <span className="text-sm text-white">
            {user.username}
          </span>
        </div>
      ))
    ) : (
      <div className="px-3 py-2 text-sm text-[#6b7491]">
      No users found
    </div>
  )}
  </div>
  )}
          </div>
          </div>
           <span className=' text-[14px] font-semibold text-[#6b7491] tracking-[0.08em] uppercase flex items-center text-start ml-7 mt-4'>Participants .{participants.length}</span>
         <div className="px-6 py-5 space-y-2">
          {
           
          participants.map((participant)=>{
            const isMe  = participant?._id === user?._id
            const isParticipantAdmin = participant?._id === adminId;
            return(
              <>
              <div key={participant?._id} className="  flex items-center gap-3 py-3 px-3 rounded-[10px] border border-[#1E2235] bg-[#0b0d17]">
                <div className="shrink-0 rounded-full w-9 h-9  border-2 border-violet-600 p-0.5">
               <img src={participant?.avatar? participant?.avatar : 'no Photo'} alt={participant?.name} className='w-full h-full rounded-full object-cover' />
               </div>
               
              <div className='flex-1 min-w-0'>
                <p className='truncate font-semibold text-white'>{isMe? 'You' : participant?.username}</p>
                {isParticipantAdmin && (
                  <p className="text-xs text-violet-400">Admin</p>
                )
                  
                }
              </div>
             {iAmAdmin && !isMe &&(
              <button className="cursor-pointer shrink-0 text-gray-400 hover:text-red-500" onClick={()=>handleRemove(participant?._id)}>
               <X  size={18} />
               </button>
              )}
              </div>
          </>
            )
          })
          }
            
         </div>
      </div>
    </div>
  )
}

export default GroupInfoModal