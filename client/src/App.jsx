import { useEffect,useState } from 'react';
import Auth from './components/Auth.jsx'
import Dashboard from './components/Dashboard.jsx'
import api from './api/axios.js'
import SocketProvider from './context/socketContext.jsx'
import { Routes, Route } from 'react-router-dom'
import ResetPassword from './components/ResetPassword.jsx'

import './App.css'

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
     <Routes>
      <Route path="/reset-password/:token" element={<ResetPassword />} />
     <Route
        path="*"
        element={
          user?<Dashboard user={user} setUser={setUser}/>:<Auth onLoginSuccess={setUser} onRegisterSuccess={setUser}/>
        }
           />
            </Routes>
  </SocketProvider>
  )
}

export default App
