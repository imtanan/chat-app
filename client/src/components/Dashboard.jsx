import  {useState}from 'react'
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import UpdateProfileModal from './UpdateProfileModal.jsx'

function Dashboard({user,setUser}) {
  const [currentChat, setCurrentChat] = useState(null);
  const [showModal, setShowModal] = useState(false)



     return (
    <div className="h-screen flex">
        <Sidebar user={user} setUser={setUser} setShowModal={setShowModal} currentChat={currentChat} setCurrentChat={setCurrentChat}  />
      <ChatWindow currentChat={currentChat}    user={user} />
   {showModal && (<UpdateProfileModal user={user} setUser={setUser} onClose={() => setShowModal(false)} />
  )}
      </div>

     
   
  );
};

export default Dashboard;