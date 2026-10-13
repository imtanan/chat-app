import  {useState,useEffect}from 'react'
import {useSocket} from '../context/useSocket.js'
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import UpdateProfileModal from './UpdateProfileModal.jsx'
import AddGroupModal from './AddGroupModal.jsx'
import GroupInfoModal from './GroupInfoModal.jsx'

function Dashboard({user,setUser}) {
  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats]= useState([]);
  const [showModal, setShowModal] = useState(false)
  const [groupModal, setGroupModal] = useState(false)
  const [groupInfo, setGroupInfo] = useState(false)

const {socket} = useSocket()

useEffect(() => {
  console.log('CHATS CHANGED:', chats.map(c => c.avatar))
}, [chats])


    useEffect(()=>{
  if (!socket) return;

  const onAvatarUpdate = ({chatId, avatar})=>{

    setCurrentChat((prev)=>(prev?._id === chatId ? {...prev, avatar}:prev))
   
    setChats((prev)=>prev.map((c)=>(c._id === chatId ? { ...c, avatar } : c)))
  }

  socket.on('groupAvatarUpdated', onAvatarUpdate);
  return()=>socket.off('groupAvatarUpdated', onAvatarUpdate);
},[socket])

useEffect(()=>{
  if (!socket) return;
  const onGroupNameUpdate=({chatId, chatName})=>{
    setCurrentChat((prev)=>(prev?._id === chatId?{...prev,chatName}:prev))
    setChats((prev)=>prev.map((c)=>(c._id===chatId?{...c,chatName}:c)))
  }
  socket.on('groupNameUpdated',onGroupNameUpdate)
  return()=>socket.off('groupNameUpdated',onGroupNameUpdate)
},[socket])

useEffect(()=>{
  if(!socket) return
  const onLeaving = ({chatId,participants,groupAdmin})=>{
    setCurrentChat((prev)=>(prev?._id === chatId ? {...prev, participants,groupAdmin}:prev))
    setChats((prev)=>prev.map((c)=>(c._id === chatId ? {...c , participants,groupAdmin} : c)))
  }
socket.on('groupLeft',onLeaving)
return()=>socket.off('groupLeft',onLeaving)

},[socket])
useEffect(()=>{
  if(!socket) return

  const addedParticipant = (chat)=>{
    setChats((prev)=>prev.some((c)=>c._id===chat._id)?prev.map((c)=>c._id===chat._id?chat:c):[chat,...prev])
    setCurrentChat((prev) => (prev?._id === chat._id ? chat : prev))
  }
socket.on('addedParticipant',addedParticipant)
return()=>socket.off('addedParticipant',addedParticipant)

},[socket])

useEffect(()=>{
  if(!socket) return

const onGroupUpdated = (chat)=>{
     setChats((prev) =>
       prev.some((c) => c._id === chat._id)
        ? prev.map((c) => (c._id === chat._id ? chat : c))
        : [chat, ...prev]
)
 setCurrentChat((prev) => (prev?._id === chat._id ? chat : prev)) 
}

  const onRemoved=({chatId})=>{
    setChats((prev)=>prev.filter((p)=>p._id !==chatId))
    setCurrentChat((prev)=>(prev?._id === chatId ? null:prev))
  }


  socket.on('groupUpdated', onGroupUpdated)
  socket.on('removedFromGroup', onRemoved)

  return () => {
    socket.off('groupUpdated', onGroupUpdated)
    socket.off('removedFromGroup', onRemoved)
  }

},[socket])

     return (
    <div className="h-screen flex">
        <Sidebar user={user} setUser={setUser} setShowModal={setShowModal} setGroupModal={setGroupModal} chats={chats} setChats={setChats} currentChat={currentChat} setCurrentChat={setCurrentChat}  />
      <ChatWindow currentChat={currentChat} setGroupInfo={setGroupInfo}    user={user} />
   {showModal && (<UpdateProfileModal user={user} setUser={setUser} onClose={() => setShowModal(false)} />
  )}

  {groupModal && (<AddGroupModal  onClose={() => setGroupModal(false)} />)}
    
    {groupInfo &&  currentChat &&  (<GroupInfoModal chats={chats} setChats={setChats} currentChat={currentChat} setCurrentChat={setCurrentChat} user={user} setUser={setUser} onClose={()=>setGroupInfo(false)} />)}
      </div>

     
   
  );
};

export default Dashboard;