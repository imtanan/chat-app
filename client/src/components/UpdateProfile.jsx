
import { UserRoundPen } from "lucide-react";

function UpdateProfile({ user, setShowModal }) {
const avatarSrc = user?.avatar
const displayName = user?.username


  return (
    <div className="mt-5 mb-2" >
      <button className="flex items-center gap-3 px-5 py-3 h-14 pl-3 w-65 mx-auto rounded-xl hover:bg-[#181A28] cursor-pointer" onClick={() => setShowModal(true)}>
        <div className="w-10 h-10   rounded-full bg-[#0b0d17] border border-[#1E2235] overflow-hidden shrink-0 flex items-center justify-center ">
       {avatarSrc ? (<img src={avatarSrc} alt="Preview" className="w-full h-full object-cover" />) : (<span className="text-[#6b7491] text-xs">No Photo</span>)}
        </div>
         <span className="text-sm  text-white truncate block">
            {displayName} 
          </span>
          <UserRoundPen size={19} className="ml-auto text-[#6b7491]"/>
          </button>
    </div>
    
  )
}

export default UpdateProfile