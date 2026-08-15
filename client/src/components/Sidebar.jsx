import {useState,useRef} from 'react'
import { Search, X } from 'lucide-react';
import api from '../api/axios.js'
function Sidebar({user,setUser}) {
   const [loading, setLoading] = useState(false);
   const [searchLoading, setSearchLoading] = useState(false);
   const [results, setResults] = useState([]);
   const [error, setError] = useState('');

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
    const searchTimeout=useRef(null);
    const [query, setQuery] = useState('');
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
  return (
    <div className="w-[300px] shrink-0 h-screen bg-blue-500 flex-col">
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






<div className='mt-auto'>
  <button disabled={loading} onClick={handleSignOut} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium flex-col hover:bg-red-600">
        { loading? "Signing Out...":"Sign Out"}
        </button>
</div>
    </div>
  )
}


export default Sidebar