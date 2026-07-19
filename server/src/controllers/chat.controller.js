import {Chat} from '../models/chat.model.js'
import {User} from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const accessChat = (asyncHandler(async(req,res)=>{
    //take user id 
    //make sure the chat we are accessing exists...Otherwise create a  new one
    //Check the isGroupChat flag if its true then make sure to add participants, chatName, admin .
    //Get the latestMessages in both cases if exists.
    const {userId} = req.body;
    const existingUser = await User.findById(userId)
    if(!existingUser){
        throw new ApiError(404,"User not found")
    }
    const {loggedInUserId} = req.user._id;
    const chat = await Chat.findOne({
      isGroupChat:false,
      
        $and:[
            {participants:{$elemMatch:{$eq:userId}}},
            {participants:{$elemMatch:{$eq:req.user._id}}},
        ],   
    }).populate("participants","-password -refreshToken")
    if(chat){
        return  res
        .status(200)
        .json(new ApiResponse(200,  chat,"Chat retrieved successfully",))
    }
 
      const newChat = await Chat.create({
         
          participants:[req.user._id,userId],
      })
      const fullChat = await Chat.findById(newChat._id).populate("participants", "-password -refreshToken")
return res
 .status(201)
        .json(new ApiResponse(201,  fullChat,"New Chat created",))


}))
const getUserChats = (asyncHandler(async(req,res)=>{
    const chats = await Chat.find({

        participants:{$elemMatch:{$eq:req.user._id}}}
    ).populate("participants", "-password -refreshToken").populate("groupAdmin","-password -refreshToken").populate("latestMessage").sort({updatedAt:-1})
    return res
    .status(200)
    .json(new ApiResponse(201,chats, chats.length===0 ? "No Chats found" : "User Chats retrieved successfully"))
}))
const createGroupChat = (asyncHandler(async(req,res)=>{
  const {chatName,participants} = req.body
  const existingUsers = await User.find({_id:{$in:participants}})
  if(existingUsers.length !== participants.length){
    throw new ApiError(400,"One or more participant IDs do not exist")
  }
  participants.push(req.user._id)
  
const createGroup = await Chat.create({
    chatName,
    isGroupChat:true,
    participants,
    groupAdmin:req.user._id,
  
})
    return res
    .status(201)
    .json(new ApiResponse(201, createGroup, "Group chat created successfully"))

}))      




export{
    accessChat,
    getUserChats,
    createGroupChat,
}