import  {useState}from 'react'
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'

function Dashboard({user,setUser}) {
  const [currentChat, setCurrentChat] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  



     return (
    <div className="h-screen flex">
        <Sidebar user={user} setUser={setUser} displayName={displayName} avatarSrc={avatarSrc} setDisplayName={setDisplayName} setAvatarSrc={setAvatarSrc}  currentChat={currentChat} setCurrentChat={setCurrentChat}  />
      <ChatWindow currentChat={currentChat} avatarSrc={avatarSrc} setDisplayName={setDisplayName} setAvatarSrc={setAvatarSrc}   user={user} />
   
      </div>

     
   
  );
};

export default Dashboard;