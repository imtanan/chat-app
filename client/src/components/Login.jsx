import  {useState} from 'react'
import api from '../api/axios.js'
function Login({onLoginSuccess}) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const handleSubmit = async(e)=>{
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
    const res = await api.post("users/login",{email,password})
    onLoginSuccess(res.data?.data?.user)
    }catch(err){
        console.log(err.response.data);
        setError(err.response?.data?.message)
    }finally{
        setLoading(false)
    }
}
  return (
    <>

<form onSubmit={handleSubmit} className="min-h  flex flex-col gap-4">
    {error && <p className='text-red-500 text-sm'>{error}</p>}
    <div className="flex flex-col gap-1.5">
    <label className="block self-start text-[11px] uppercase tracking-[0.08em]  font-semibold text-[#6b7491]">Email</label>
    <input className="bg-[#0b0d17] w-full text-sm rounded-lg px-[14px] py-[11px] text-white placeholder:text-[#6b7491] outline-none focus:border-violet-600 transition-colors border border-[#1E2235]" type="email" value={email}onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com"/>

</div>
  <div className="flex flex-col gap-1.5">
    <label className="block self-start text-[11px] uppercase tracking-[0.08em] font-semibold text-[#6b7491]">Password</label>
    <input className="bg-[#0b0d17] w-full text-sm rounded-lg px-[14px] py-[11px] text-white placeholder:text-[#6b7491] outline-none focus:border-violet-600 transition-colors border border-[#1E2235]" type="password" value={password}onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••"/>
</div>
    <div className="flex justify-end">
        <a href="#" className="text-sm text-violet-600 hover:underline">Forgot password?</a>
    </div>

    <button type="submit" disabled={loading}  className="w-full bg-gradient-to-r from-violet-600 to-violet-800 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
      { loading? 'Signing In...' : 'Sign In'}
    </button>

    
</form>
    </>
  )
}

export default Login