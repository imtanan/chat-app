import  {useState}from 'react'
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import UpdateProfileModal from './UpdateProfileModal.jsx'
import AddGroupModal from './AddGroupModal.jsx'

function Dashboard({user,setUser}) {
  const [currentChat, setCurrentChat] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const [groupModal, setGroupModal] = useState(false)



     return (
    <div className="h-screen flex">
        <Sidebar user={user} setUser={setUser} setShowModal={setShowModal} setGroupModal={setGroupModal} currentChat={currentChat} setCurrentChat={setCurrentChat}  />
      <ChatWindow currentChat={currentChat}    user={user} />
   {showModal && (<UpdateProfileModal user={user} setUser={setUser} onClose={() => setShowModal(false)} />
  )}

  {groupModal && (<AddGroupModal  onClose={() => setGroupModal(false)} />)}
      </div>

     
   
  );
};

export default Dashboard;