import {useState, useRef} from 'react'

import {Search, X } from 'lucide-react';
import api from '../api/axios.js'

function AddGroupModal({onClose}) {
  const [groupName, setGroupName] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResults] = useState('');

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


        </div>
     </div>
    </div>
  )
}

export default AddGroupModal