import {useState,useRef} from 'react'
import {X } from 'lucide-react';
import api from '../api/axios.js'

function UpdateProfileModal({user,setUser,onClose}) {
const avatarSrc = user?.avatar
const fileInputRef = useRef(null)
const displayName = user?.username
const [error, setError] = useState('');
const [success, setSuccess] = useState(false);
const [selected, setSelected] = useState(0);
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [oldPassword, setOldPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
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
  const updatedData = {}
  setLoading(true)
  try{
  const formData = new FormData();
  if(avatarFile){
  formData.append("avatar", avatarFile)
  const avatarRes = await api.patch("users/avatar", formData)
   updatedData.avatar = avatarRes.data.data.avatar
  }
  console.log("Form Data:", formData) 
  if(!avatarFile && !username && !email){
    setError("Please make changes before saving.")
    setLoading(false)
    return 
  }
  
if(username || email){
   await api.patch("users/update-account", {username,email})
}

  setSuccess(true)
  
  setUser(prevUser=>({
    ...prevUser,
    username: username || prevUser.username,
    email: email || prevUser.email,
    avatar: updatedData.avatar || prevUser.avatar,
  }))
  onClose()
  }catch{
    setError("Failed to save changes")
  }
  finally{
    setLoading(false)
  }
}

const handleChangePassword = async()=>{
  if(!oldPassword || !newPassword){
    setError("Please fill in both fields.")
    return
  }

  try{
  const response = await api.post("users/change-password", {oldPassword,newPassword})
  console.log(response.data.data)
  setLoading(true)
  setSuccess(true)
  setOldPassword('')
  setNewPassword('')
  onClose()
}catch{
 setError("Failed to change password")
}finally{
  setLoading(false)
}
}
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
  <div className="bg-[#0d0f1a] border border-[#1E2235] rounded-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
    {/* modal content */}
    {/* Header */}
   <div className="flex items-center justify-between px-6 pb-3 pt-6">
          <h2 className="text-white font-bold text-lg">My Profile</h2>
          <button onClick={onClose} className="text-[#6b7491] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* user row */}
        <div className="flex items-center gap-3 px-6 pb-5 pt-2 border-b border-[#1E2235]">
        
       <div className="w-14 h-14   rounded-full bg-[#0b0d17] border border-[#1E2235] overflow-hidden shrink-0 flex items-center justify-center  ">
       {avatarSrc ? (<img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover"  />) : (<span className="text-[#6b7491] text-xs">No Photo</span>)}
        </div>
        <div>
<p className="text-white text-start font-semibold">{displayName}</p>
<p className="text-xs text-[#6b7491]">{user?.email}</p>
        </div>
        
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
       {/* Icons + Slider Section */}
<div className="-mx-6 border-b border-[#1E2235] px-6">
  {/* Icons + Text */}
  <div className="flex items-center justify-center gap-10 py-2 relative">
    {/* user info */}
    <button
      onClick={() => setSelected(0)}
      className="flex flex-col items-center gap-1 cursor-pointer transition-opacity hover:opacity-80 relative pb-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="none"
        stroke={selected === 0 ? "#7c3aed" : "#6b7491"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
      <span
        className={`text-xs font-medium transition-colors ${
          selected === 0 ? "text-violet-600" : "text-[#6b7491]"
        }`}
      >
        User Info
      </span>
      {/* Underline - only shows when selected */}
      {selected === 0 && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-12 bg-gradient-to-r from-violet-600 to-violet-800 rounded-full" />
      )}
    </button>

    {/* Security */}
    <button
      onClick={() => setSelected(1)}
      className="flex flex-col items-center gap-1 cursor-pointer transition-opacity hover:opacity-80 relative pb-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="none"
        stroke={selected === 1 ? "#7c3aed" : "#6b7491"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      </svg>
      <span
        className={`text-xs font-medium transition-colors ${
          selected === 1 ? "text-violet-600" : "text-[#6b7491]"
        }`}
      >
        Security
      </span>
      {/* Underline - only shows when selected */}
      {selected === 1 && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-12 bg-gradient-to-r from-violet-600 to-violet-800 rounded-full" />
      )}
    </button>
  </div>
</div>
         {/* error message */}
         {error &&<p className="text-red-500 text-sm">{error}</p>}
      
 {selected===0 ? (<> 
  <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
         <div className="w-33 h-33 rounded-full bg-[#0b0d17] border border-[#1E2235] flex items-center justify-center overflow-hidden">
{avatarPreview ? (<img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />) : avatarSrc?(<img src={avatarSrc} alt='currentAvatar' className='w-full h-full object-cover'/>) : (<span className="text-[#6b7491] text-xs">No Photo</span>)}
 </div>
 <input ref={fileInputRef} type="file" accept="image/*" onChange={updateAvatar} className="hidden" />
          <label className='text-sm text-violet-600 cursor-pointer' onClick={() => fileInputRef.current?.click()}>
            {avatarSrc ? 'Update Photo' : 'Upload Photo'}
          </label>
</div>
          <div>
            <label className='block text-[14px] text-start font-semibold text-[#6b7491] tracking-[0.08em] uppercase ml-1 mb-2'>Username</label>
           <input 
           value={username} 
           onChange={(e)=>setUsername(e.target.value)}
           className="w-full  px-[8px]  py-[11px] text-sm border border-[#1E2235] bg-[#0b0d17] rounded-[10px] text-white outline-none focus:border-violet-600"
           /> 
          </div>
          
          <div>
            <label className="block text-[14px] text-start font-semibold text-[#6b7491] tracking-[0.08em] uppercase ml-1 mb-2">Email</label>
         <input 
         value={email}
         onChange={(e)=>setEmail(e.target.value)} 
         className='w-full px-[8px] py-[11px] text-sm border border-[#1E2235] bg-[#0b0d17] rounded-[10px] text-white outline-none focus:border-violet-600'
         />
          </div>
             {/* Save Button */}
        <div className="px-6 pb-6">
          <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 mt-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Info"}
          </button>
        </div>
</>) : (
  <>
   <div>
        <label className="block text-[14px] text-start font-semibold text-[#6b7491] tracking-[0.08em] uppercase ml-1 mb-2">Old Password</label>
        <input 
          type="password"
          value={oldPassword}
          onChange={(e)=>setOldPassword(e.target.value)} 
          className='w-full px-[8px] py-[11px] text-sm border border-[#1E2235] bg-[#0b0d17] rounded-[10px] text-white outline-none focus:border-violet-600'
         
        />
      </div>

      <div>
        <label className="block text-[14px] text-start font-semibold text-[#6b7491] tracking-[0.08em] uppercase ml-1 mb-2">New Password</label>
        <input 
          type="password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)} 
          className='w-full px-[8px] py-[11px] text-sm border border-[#1E2235] bg-[#0b0d17] rounded-[10px] text-white outline-none focus:border-violet-600'
          
        />
      </div>

      <button
        onClick={handleChangePassword}
        disabled={loading}
        className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 text-white disabled:opacity-50"
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
  </>

)}

        </div>
        
  </div>
</div>
  ) 
}

export default UpdateProfileModal