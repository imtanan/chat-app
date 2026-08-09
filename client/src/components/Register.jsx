import React, {useState} from 'react'
import api from '../api/axios.js'
function Register({onRegisterSuccess}) {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const handleSubmit = async(e)=>{
  e.preventDefault()
  setError('')
  setLoading(true)
  try{
      const res = await api.post("users/register", {username,email,password})
      onRegisterSuccess(res.data.data.user)
  }catch(err){
    setError(err.message)
  }finally{
    setLoading(false)
  }
}


  return (
<form onSubmit={handleSubmit} className="min-h  flex flex-col gap-4">
  {error && <p className='text-red-500 text-sm'>{error}</p>}
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