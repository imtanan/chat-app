import  {useState} from 'react'
import api from '../api/axios.js'
function Register({onRegisterSuccess}) {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [avatarPreview, setAvatarPreview] = useState(null);

const handleSubmit = async(e)=>{
  e.preventDefault()
  setError('')
  setLoading(true)
  try{
      const res = await api.post("users/register", {username,email,password})
      onRegisterSuccess(res.data.data)
      console.log("REGISTERED USER:", res.data.data.user);
      console.log("FULL REGISTER RESPONSE:", res.data);
  }catch(err){
    console.log('Full Error', err)
    console.log('RESPONSE DATA:', err.response?.data)
    const message = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Something went wrong";
    setError(message)
  }finally{
    setLoading(false)
  }
}
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if(!file) return ;
  setLoading(true)
  try{
  setAvatarPreview(URL.createObjectURL(file))
  }catch(err){
    console.log('Error uploading file:', err)
    setError("Failed to upload file")
  }finally{
  setLoading(false)
}
}


  return (
<form onSubmit={handleSubmit} className="min-h  flex flex-col gap-4">
  {error && <p className='text-red-500 text-sm'>{error}</p>}
  <div className="flex flex-col items-center gap-2">
  <div className="w-28 h-28 rounded-full bg-[#0b0d17] border border-[#1E2235] flex items-center justify-center overflow-hidden">
{avatarPreview ? (<img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />) : (<span className="text-[#6b7491] text-xs">No Photo</span>)}
  </div>
<label className='text-xs text-violet-600 cursor-pointer'>
  Upload Photo (optional)
  <input type="file" disabled={loading} className="hidden" accept="image/*" onChange={handleFileChange} />
</label>
  </div>


    <div className="flex flex-col gap-1.5">
    <label className="block tracking-[0.08em] font-semibold text-[11px] self-start  uppercase  text-[#6b7491]">Username</label>
    <input className="bg-[#0b0d17] w-full text-sm px-[14px] py-[11px]  rounded-lg text-white placeholder:text-[#6b7491] outline-none focus:border-violet-600 transition-colors border border-[#1E2235]" type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="your username"/>

</div>
    <div className="flex flex-col gap-1.5">
    <label className="block tracking-[0.08em] font-semibold text-[11px] self-start  uppercase  text-[#6b7491]">Email</label>
    <input className="bg-[#0b0d17] w-full text-sm px-[14px] py-[11px] rounded-lg text-white placeholder:text-[#6b7491] outline-none focus:border-violet-600 transition-colors border border-[#1E2235]" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com"/>

</div>
  <div className="flex flex-col gap-1.5">
    <label className="block tracking-[0.08em] font-semibold text-[11px] self-start  uppercase  text-[#6b7491]">Password</label>
    <input className="bg-[#0b0d17] w-full text-sm px-[14px] py-[11px] rounded-lg text-white placeholder:text-[#6b7491] outline-none focus:border-violet-600 transition-colors border border-[#1E2235]" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••"/>
</div>
 

    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-violet-800 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
      {loading? 'Creating Account...' : 'Create Account'}
    </button>

    
</form>
  )
}

export default Register