import dotenv from "dotenv";
dotenv.config({
    path: './.env',
})
import jwt from 'jsonwebtoken'
import {User} from './models/user.model.js'
import connectDB from './db/index.js'
import {createServer} from 'http'
import {Server} from 'socket.io'
import { app } from './app.js'

const httpServer = createServer(app)//when we are not using socket, express does this internally without showing us when we do app.listen....but when using socket, we need this httpServer for putting in io thats why we have to explicitly assign it in this case....Purpose: its purpose is to create a server where app could listen to connect an HTTP SERVER for apis
const io = new Server(httpServer, {
    cors:{
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
})

io.use(async(socket,next)=>{
    try{
    const token = socket.handshake.auth?.token;
    if(!token){
        return next(new Error('Authentication Error'))
    }
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if(!user){
        throw new Error("User not found");
    }
    socket.user = user;
    next();

    }catch(err){
     next(new Error("Authentication failed"));
    }
})
io.on('connection', (socket)=>{
    socket.on('joinChat',(chatId)=>{
         socket.join(chatId)
         console.log(`User ${socket.user.username} has joined the room: ${chatId}`)

         socket.to(chatId).emit('userJoined',{
            username:socket.user.username,
            userId:socket.user._id
         })
    })
    console.log('A User connected: ', socket.id)
})

connectDB()
.then(()=>{
    httpServer.listen(process.env.PORT || 8000, "0.0.0.0", ()=>{
     console.log(`⚙️ Server is running at port: ${process.env.PORT || 8000}`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!", err)
})