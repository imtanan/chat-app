import {useState, useRef} from 'react'
import {useSocket} from '../context/useSocket.js'
import {Search, X,Check } from 'lucide-react';
import api from '../api/axios.js'

function AddGroupModal({onClose}) {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResults] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);

const searchTimeout=useRef(null)
const handleInputChange = async(e)=>{
  const value = e.target.value.trim()
  setQuery(value)
clearTimeout(searchTimeout.current)
searchTimeout.current = setTimeout(async()=>{
  try{
    const response = await api.get(`users/search?search=${value}`)
        setResults(response.data.data)
  }catch(err){
console.log(err)
}
}, 500)
}

const toggleParticipant=(user)=>{
 setSelectedParticipants((prev)=>
    prev.some((p)=>p._id === user._id)? prev.filter((p)=> p._id !== user._id) : [...prev,user]
)
}

const handleCreateGroup = async()=>{
try{
api.post('chats/createGroupChat', {
  chatName:groupName,
  participants:selectedParticipants.map(p=>p._id)
})
onClose()
}catch{
setError('Something went wrong please try again')
}
}


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose} > 
     <div className='bg-[#0d0f1a] border border-[#1E2235] rounded-2xl w-full max-w-md mx-4 ' onClick={(e)=>e.stopPropagation()} >
        <div className="flex items-center justify-between px-6 pb-0 mb-0 pt-6" >
              <h2 className="text-white font-bold text-lg m-0" >New Group</h2>
              <button className="text-[#6b7491] hover:text-white" onClick={onClose} > 
                <X className="w-5 h-5" />
              </button>
            </div>
            
             <span className="block px-6 pb-4 text-[#6b7491] text-xs">Select at least 2 participants</span>
            
              {/* Group form */}
         <div className="px-6 py-5 mt-1 space-y-10">
             {error &&<p className="text-red-500 text-sm">{error}</p>}
       <div>
            <label className='block text-[14px] text-start font-semibold text-[#6b7491] tracking-[0.08em] uppercase ml-1 mb-2'>Group Name</label>
           <input 
           value={groupName} 
           onChange={(e)=>setGroupName(e.target.value)}
           placeholder="e.g Design Team"
           className="w-full  px-[8px]  py-[11px] text-sm border border-[#1E2235] bg-[#0b0d17] rounded-[10px] text-white outline-none focus:border-violet-600"
           /> 
         </div>
       <div className="relative mt-2 mb-4 w-full mx-auto"> 
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7491] pointer-events-none" />
           <input 
           onChange={handleInputChange}
           value={query} 
           placeholder="Search users..."
           className="w-full pl-8 pr-4 py-2.5  rounded-lg bg-[#0b0d17] border border-[#1E2235] text-white text-sm placeholder:text-[#6b7491] outline-none focus:border-violet-600 transition-colors"
           />          
         </div>
         {selectedParticipants.length>0 && (
          <div className='flex flex-wrap gap-2 mb-3'>
          {selectedParticipants.map((user)=>(
            <div key={user._id} className='flex items-center gap-1 bg-[#111320] border border-[#1E2235] rounded-full pl-1 pr-2 py-1'>
               <img
            src={user.avatar}
            className=" w-8 h-8 rounded-full"
          />
          <span className='text-xs text-white'>{user.username}</span>
          <X className='relative cursor-pointer' onClick={()=>toggleParticipant(user)} />
            </div>
          ))}
          </div>
         )}
         {query && (result.length>0 ?(
          <div className="mt-2 space-y-1 bg-gray-600/40">
            { result.map((user)=>{
             const isSelected = selectedParticipants.some((p)=> p._id === user._id)
              return(<div
          key={user._id}
          onClick={()=>toggleParticipant(user)}
          className="flex items-center justify-between px-2 py-1 gap-2 rounded-lg hover:bg-[#111320] cursor-pointer"
        >
          <div className='flex items-center gap-2'>
          <img
            src={user.avatar}
            className=" w-8 h-8 rounded-full"
          />
     
      
          <span className="text-sm text-white">
            {user.username}
          </span>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
    isSelected
      ? 'bg-violet-600 border-violet-600'
      : 'border-[#6b7491] bg-transparent'
  }`}>
           <Check
            type="checkbox"
            checked={isSelected }
            onChange={()=>toggleParticipant(user)}
            onClick={(e)=>e.stopPropagation()}
             className="w-4 h-4 text-white cursor-pointer strokeWidth={3}"
            />
            </div>
        </div>
             )}
            )}
          </div>
          ): (
    <span className="text-sm text-white">
      No users found
    </span>)
    )}

         <div className="px-6 pb-6">
          <button
          onClick={handleCreateGroup}
          disabled={loading || !groupName.trim() || selectedParticipants.length<2}
          className="w-full py-3 mt-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 text-white disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>

        </div>
     </div>
    </div>
  )
}

export default AddGroupModal