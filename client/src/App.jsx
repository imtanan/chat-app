import { useEffect,useState } from 'react';
import Auth from './components/Auth.jsx'
import Dashboard from './components/Dashboard.jsx'
import api from './api/axios.js'
import SocketProvider from './context/socketContext.jsx'


import './App.css'
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTUyN2U4NzQwODcyZWI1YWJmOWM2NDUiLCJlbWFpbCI6InJhb0ByYW8uY29tIiwidXNlcm5hbWUiOiJyYW8iLCJpYXQiOjE3ODUxNjEyMTYsImV4cCI6MTc4NTI0NzYxNn0.tLD9qEtYuMUEddVgMq4rLHTSM6UeOFT89-fTsYsfwA8
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    api.get('users/current-user')
    .then(res=>setUser(res.data.data))
    .catch(()=>setUser(null))
    .finally(()=>setLoading(false))
  },[])
  if(loading) return null
  
  return (
  <SocketProvider user={user}>
  {user?(<Dashboard user={user} setUser={setUser}/>):(<Auth onLoginSuccess={setUser} onRegisterSuccess={setUser}/>)}
  </SocketProvider>
  )
}

export default App
