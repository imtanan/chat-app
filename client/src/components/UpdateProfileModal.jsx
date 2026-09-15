import {useState} from 'react'
import {X } from 'lucide-react';
import api from '../api/axios.js'

function UpdateProfileModal({user,setUser,onClose}) {
const avatarSrc = user?.avatar
const displayName = user?.username
const [error, setError] = useState('');
const [success, setSuccess] = useState(false);
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [avatarFile, setAvatarFile] = useState(null);
const [avatarPreview, setAvatarPreview] = useState(null);
const [loading, setLoading] = useState(false);
function updateAvatar(e) {

e.preventDefault();
const file=e.target.files?.[0]
if(!file)return
setLoading(true)
try{
  setAvatarFile(file)
  setAvatarPreview(URL.createObjectURL(file))
}catch(err){
 console.log('Error uploading file:', err)
    setError("Failed to upload file")
}
finally{
  setLoading(false)
}

}
const handleSave = async()=>{
  setLoading(true)
  try{
  api.patch("users/update-account", {username,email})
  api.patch("users/avatar", avatarFile? {avatar:avatarFile}:null)
  setSuccess(true)
  setUser(prevUser=>({
    ...prevUser,
    username: username || prevUser.username,
    email: email || prevUser.email,
    avatar: avatarPreview || prevUser.avatar,
  }))
  onClose()
  }catch{
    setError("Failed to save changes")
  }
  finally{
    setLoading(false)
  }
}

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
  <div className="bg-[#0d0f1a] border border-[#1E2235] rounded-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
    {/* modal content */}
    {/* Header */}
   <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E2235]">
          <h2 className="text-white font-bold text-lg">My Profile</h2>
          <button onClick={onClose} className="text-[#6b7491] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* user row */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1E2235]">
        
       <div className="w-10 h-10   rounded-full bg-[#0b0d17] border border-[#1E2235] overflow-hidden shrink-0 flex items-center justify-center ">
       {avatarSrc ? (<img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover"  />) : (<span className="text-[#6b7491] text-xs">No Photo</span>)}
        </div>
        <div>
<p className="text-white font-semibold">{displayName}</p>
<p className="text-xs text-[#6b7491]">{user?.email}</p>
        </div>
        
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
         {/* error message */}
         {error &&<p className="text-red-500 text-sm">{error}</p>}
      
      <div className="flex flex-col items-center gap-2">
         <div className="w-28 h-28 rounded-full bg-[#0b0d17] border border-[#1E2235] flex items-center justify-center overflow-hidden">
{avatarPreview ? (<img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />) : (<span className="text-[#6b7491] text-xs">No Photo</span>)}
 </div>
          <label className='text-xs text-violet-600 cursor-pointer'>{avatarPreview? 'Update Photo' : 'Upload Photo' }</label>
</div>
          <div>
            <label className='block text-[11px] font-semibold text-[#6b7491] tracking-[0.08em] uppercase mb-1.5'>Username</label>
           <input 
           value={username} 
           onChange={(e)=>setUsername(e.target.value)}
           className="w-full px-[14px]  py-[11px] text-sm border border-[#1E2235] bg-[#0b0d17] rounded-[10px] text-white outline-none focus:border-violet-600"
           />
          </div>
          
          <div>
            <label className="block text-[11px] font-semibold text-[#6b7491] tracking-[0.08em] uppercase mb-1.5">Email</label>
         <input 
         value={email}
         onChange={(e)=>setEmail(e.target.value)} 
         className='w-full px[14px] py-[11px] text-sm border border-[#1E2235] bg-[#0b0d17] rounded-[10px] text-white outline-none focus:border-violet-600'
         />
          </div>
        </div>
     {/* Save Button */}
        <div className="px-6 pb-6">
          <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Info"}
          </button>
        </div>
  </div>
</div>
  ) 
}

export default UpdateProfileModal