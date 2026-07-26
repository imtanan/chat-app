import { useEffect } from 'react';
import {io} from "socket.io-client";

import './App.css'

function App() {
  const chatId = "6a5f95a8371b470390e1232a"
  useEffect(()=>{
    const socket = io('http://localhost:8000', {
      auth:{
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTUyMzQzMjY5OWMxY2JjZjMxNzUzNDkiLCJlbWFpbCI6ImhAaGMuY29tIiwidXNlcm5hbWUiOiJpbXRhbmFuIGFobmFmIiwiaWF0IjoxNzg0OTgwOTE3LCJleHAiOjE3ODUwNjczMTd9.53N3ELR8rg6Ncbn3Ofg7E6j8NXXxFZe_V8oCL613r5Y"
      }
    });
    socket.on('connect',()=>{
      console.log("Connected! Socket ID: ", socket.id)
    })
   socket.emit('joinChat', chatId)
    socket.on('disconnect', ()=>{//A listener that shows disconnected message upon the reaction to disconnection, no matter why it happened, server crashed, network dropped, user close the tab.
      console.log('Disconnected!')
    })
    socket.on('userJoined', (data)=>{
      console.log(`${data.username} joined the room`)
    })
    socket.on('connect_error', (err)=>{
      
      console.log(err.message)
      
    })
    return ()=>{
      socket.disconnect()//An action that runs when the component unmounts
    }
  }, [])

  return (
  <h1>Socket Test</h1>
  )
}

export default App
