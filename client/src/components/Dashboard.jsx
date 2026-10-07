import  {useState}from 'react'
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



     return (
    <div className="h-screen flex">
        <Sidebar user={user} setUser={setUser} setShowModal={setShowModal} setGroupModal={setGroupModal} chats={chats} setChats={setChats} currentChat={currentChat} setCurrentChat={setCurrentChat}  />
      <ChatWindow currentChat={currentChat} setGroupInfo={setGroupInfo}    user={user} />
   {showModal && (<UpdateProfileModal user={user} setUser={setUser} onClose={() => setShowModal(false)} />
  )}

  {groupModal && (<AddGroupModal  onClose={() => setGroupModal(false)} />)}
    
    {groupInfo && (<GroupInfoModal setChats={setChats} currentChat={currentChat} setCurrentChat={setCurrentChat} user={user} setUser={setUser} onClose={()=>setGroupInfo(false)} />)}
      </div>

     
   
  );
};

export default Dashboard;