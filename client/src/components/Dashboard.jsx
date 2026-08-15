import  {useState}from 'react'
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'

function Dashboard({user,setUser}) {
   
  return (
    <div className="min-h-screen flex">
        <Sidebar user={user} setUser={setUser} />
      <ChatWindow />
       

        
      </div>

     
   
  );
};

export default Dashboard;