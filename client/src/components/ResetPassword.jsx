import {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import api from '../api/axios.js'

function ResetPassword() {
  const {token} = useParams()
  const navigate = useNavigate()

    const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

   const mismatch = confirmPassword !== '' && password !== confirmPassword
  const canSubmit = password.length >= 8 && password === confirmPassword && !loading

  const inputClass =
    'w-full pl-10 pr-10 py-3 text-sm text-white placeholder:text-[#6b7491] border border-[#1E2235] bg-[#0b0d17] rounded-[10px] outline-none focus:border-violet-600'

    const handleSubmit = async(e)=>{
      e.preventDefault()
      setError('')
      setLoading(true)

      try{
        await api.post(`users/reset-password/${token}`,{password,confirmPassword})
        setSuccess(true)
      setTimeout(() => navigate('/'), 2500)
      }catch(err){
        setError(err.response?.data?.message || 'This reset link is invalid or has expired.')
      }finally{
        setLoading(false)
      }
    }


  return (
    <div className='min-h-screen flex items-center justify-center bg-[#080a12] px-4'>
    <div className='w-full max-w-md'>
      <div className="text-center mb-8">
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
  <p className="text-sm text-[#6b7491]">Choose a new password for your account.</p>
</div>

    <div className='rounded-xl border border-[#1E2235] bg-[#11131f] p-8'>
{success ? (
  <div className='text-center space-y-4'>
  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Password updated</h2>
              <p className="text-sm text-[#6b7491]">Redirecting you to sign in...</p>
              <button
                onClick={() => navigate('/')}
                className="w-full rounded-[10px] bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
              >
                Go to sign in
              </button>
  </div>
):(
    <form onSubmit={handleSubmit} className="space-y-5">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-sm text-[#6b7491] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </button>

              <div>
                <h2 className="text-xl font-bold text-white">Reset your password</h2>
                <p className="mt-1 text-sm text-[#6b7491]">Use at least 8 characters.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-[#6b7491] mb-2">
                  New password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6b7491] pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7491] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-[#6b7491] mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6b7491] pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className={`${inputClass} ${mismatch ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                </div>
                {mismatch && <p className="mt-1 text-xs text-red-400">Passwords don't match.</p>}
              </div>

              {error && (
                <p className="rounded-[10px] border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-[10px] py-3 text-sm font-semibold transition-colors bg-violet-600 text-white hover:bg-violet-500 disabled:bg-[#2a2d3e] disabled:text-[#6b7491] disabled:cursor-not-allowed disabled:hover:bg-[#2a2d3e]"
              >
                {loading ? 'Updating...' : 'Reset password'}
              </button>
            </form>
)}
    </div>

    </div>
    </div>
  )
}

export default ResetPassword