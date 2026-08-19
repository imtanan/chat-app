import  {useState}from 'react'
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'

function Dashboard({user,setUser}) {
  const [currentChat, setCurrentChat] = useState(null);
   
  return (
    <div className="min-h-screen flex">
        <Sidebar user={user} setUser={setUser}  currentChat={currentChat} setCurrentChat={setCurrentChat}/>
      <ChatWindow currentChat={currentChat} />
       

        
      </div>

     
   
  );
};

export default Dashboard;