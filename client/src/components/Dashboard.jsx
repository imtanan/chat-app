import  {useState}from 'react'
import api from '../api/axios.js'
function Dashboard({user,setUser}) {
    const [loading, setLoading] = useState(false);
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
  return (
    <div className="min-h-screen bg-[#111320] text-white p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-gray-400">Welcome, {user.username}</p>
        </div>

        <button disabled={loading} onClick={handleSignOut} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium hover:bg-red-600">
        { loading? "Signing Out...":"Sign Out"}
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-[#1E2235] bg-[#0B0D17] p-6">
        <h2 className="text-lg font-semibold">Your Dashboard</h2>
        <p className="mt-2 text-sm text-gray-400">
          This is a simple dashboard for testing.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;