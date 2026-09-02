import {useContext} from 'react'
import {SocketContext} from './socketContext.jsx'
export const useSocket = ()=>{
    return useContext(SocketContext)
}