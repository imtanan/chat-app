import {useState} from 'react'
import Login from './Login.jsx'
import Register from './Register.jsx'
import api from '../api/axios.js'
import { ArrowLeft, Mail } from 'lucide-react'

function Auth({onLoginSuccess,onRegisterSuccess}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('')
const [loading, setLoading] = useState(false)
 const [showForgot, setShowForgot] = useState(false)

const isEmpty = email.trim()===""

const handleForgot=async (e)=>{
  e.preventDefault()
  setLoading(true)
try{
await api.post("users/forgot-password",{email})
setMessage("If an account exists, we sent a reset link.")
}catch(err){
  console.log('error sending email',err)
  setMessage('The email you entered does not exist. Please register or use a different email')
}finally{
  setLoading(false)
}
}

  return (
    <>

 <div className="auth-bg  flex flex-col  items-center gap-2 min-h-screen pt-20 ">
  <div className="text-center mb-2">
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
  {showForgot ? (<p className="font-['Inter',sans-serif] text-[#6B7491] text-[13px] m-0">Securely recover access to your account.</p>):(isLogin? (<p className="font-['Inter',sans-serif] text-[#6B7491] text-[13px] m-0">Welcome back. Sign in to continue.</p> ): (<p className="font-['Inter',sans-serif] text-[#6B7491] text-[13px] m-0">Create your account to get started.</p>))}
 
</div>

  {/* CARD */}
  {showForgot ? (
     <div className="bg-[#111320] rounded-[20px] p-8 w-full max-w-[420px] border border-[#1E2235] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
  <form onSubmit={handleForgot} className="space-y-5">
      <div>
      <h2 className="text-xl font-bold text-white">Forgot password?</h2>
      <p className="mt-1 text-sm text-[#6b7491]">
        Enter your email and we'll send you a link to reset your password.
      </p>
    </div>

    <div className="relative">
      <Mail className="w-4 h-4 text-[#6b7491] pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#6b7491] border border-[#1E2235] bg-[#0b0d17] rounded-[10px] outline-none focus:border-violet-600"
      />
    </div>

    {message && (
      <p className="rounded-[10px] border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-300">
        {message}
      </p>
    )}

    <button
      type="submit"
      disabled={isEmpty||loading}
      
      className="w-full rounded-[10px] bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Sending...' : 'Send reset link'}
    </button>

    <button
      type="button"
      onClick={() => { setShowForgot(false); setMessage('') }}
      className="mx-auto flex items-center gap-2 text-sm text-[#6b7491] hover:text-white transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to login
    </button>
  </form>
  </div>
) :(
  <div className="bg-[#111320] rounded-[20px] p-8 w-full max-w-[420px] border border-[#1E2235] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">

    <div className="relative h-12 rounded-xl bg-[#0b0d17] p-1 overflow-hidden">
      <div
        className={`absolute top-1 left-1 h-10 w-[calc(50%-4px)] rounded-lg bg-gradient-to-r from-violet-600 to-violet-800 transition-transform duration-300 ${
          isLogin ? 'translate-x-0' : 'translate-x-full'
        }`}
      />
      <div className="relative flex w-full h-full z-10">
        <button
          className={`rounded text-[15px] py-2 w-1/2 font-outfit transition-colors duration-200 ${isLogin ? "text-white" : "text-gray-500"}`}
          onClick={() => setIsLogin(true)}
        >
          Sign In
        </button>
        <button
          className={`rounded text-[15px] py-2 w-1/2 font-outfit transition-colors duration-200 ${isLogin ? "text-gray-500" : "text-white"}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>
    </div>

    <div className="mt-6">
      {isLogin ? <Login setShowForgot={setShowForgot} onLoginSuccess={onLoginSuccess}/> : <Register onRegisterSuccess={onRegisterSuccess}/>}
    </div>

  </div>)}
</div>
    
   
    </> 
  )
}

export default Auth