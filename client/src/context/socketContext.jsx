import  {useState,useEffect,createContext} from 'react'
import {io} from "socket.io-client";

const SocketContext = createContext(null);
 



const SocketProvider = ({children,user})=> {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [socket, setSocket]= useState(null)
  
  useEffect(()=>{
     if (!user) return;

  const newSocket= io('http://localhost:8000', {
    withCredentials: true,
  })

setSocket(newSocket)
  
  newSocket.on('userOnline', (userId) => {
      
        setOnlineUsers((prev) => [...new Set([...prev, userId])]);
      })
      newSocket.on('userOffline',(userId)=>{
         
        setOnlineUsers((prev)=>prev.filter((id)=>id!==userId))
      })
      
      newSocket.on('showOnlineUsers', (ids)=>{
          
         setOnlineUsers(ids);
      })

       return () => {
      newSocket.disconnect();
      
      setSocket(null);
    };
    },[user])
  return (
    <SocketContext.Provider value={{socket,onlineUsers}}>
        {children}
        </SocketContext.Provider>
  )
}
export {SocketContext}
export default SocketProvider