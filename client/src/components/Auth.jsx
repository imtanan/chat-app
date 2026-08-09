import React, {useState} from 'react'
import Login from './Login.jsx'
import Register from './Register.jsx'

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>

 <div className="auth-bg  flex flex-col  items-center gap-2 min-h-screen justify-center ]">
 <div className="flex items-center gap-1.5 mb-2">
  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white" />
    </svg>
  </div>
  <span className="font-outfit font-extrabold text-xl text-[#E4E6F0] tracking-[-0.02em]">
    PULSE<span className="text-violet-600">.</span>
  </span>
</div>


  {/* CARD */}
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
      {isLogin ? <Login /> : <Register />}
    </div>

  </div>
</div>
    
   
    </>
  )
}

export default Auth