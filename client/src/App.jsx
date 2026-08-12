import { useEffect,useState } from 'react';
import Auth from './components/Auth.jsx'
import Dashboard from './components/Dashboard.jsx'
import api from './api/axios.js'
import {io} from "socket.io-client";

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
  // const chatId = "6a5f95a8371b470390e1232a"
  // useEffect(()=>{
  //   const myToken=localStorage.getItem("token");
  //   const socket = io('http://localhost:8000', {
  //     auth:{
  //       token:myToken
  //     }
  //   }); 
  //   socket.on('connect',()=>{
  //     console.log("Connected! Socket ID: ", socket.id)
  //     socket.emit('joinChat', chatId)
  //   })
  //   socket.on('disconnect', ()=>{//A listener that shows disconnected message upon the reaction to disconnection, no matter why it happened, server crashed, network dropped, user close the tab.
  //     console.log('Disconnected!')
  //   })
  //   socket.on('userJoined', (data)=>{
  //     console.log(`${data.username} joined the room`)
  //   })
  //   socket.on('newMessage',(message)=>{
  //     console.log('new Message received :', message)
  //   })
  //   socket.on('userOnline',(userId)=>{
  //     console.log(`${userId} is Online`)
  //   })
  //   socket.on('userOffline',(userId)=>{
  //     console.log(`${userId} is Offline`)
  //   })
  //   socket.on('showOnlineUsers',(data)=>{
  //     const num = data.length
  //     console.log(`${num === 0 ? 'No users' : num === 1 ? '1 user' : `${num} users`} online`)
  //   })

  //   socket.on('connect_error', (err)=>{
      
  //     console.log(err.message)
      
  //   })
  //   return ()=>{
  //     socket.disconnect()//An action that runs when the component unmounts
  //   }
  // }, [])

  return (
  <>
  {user?(<Dashboard user={user} setUser={setUser}/>):(<Auth onLoginSuccess={setUser}/>)}
  </>
  )
}

export default App
