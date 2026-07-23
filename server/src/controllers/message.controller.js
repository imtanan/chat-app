import {Message} from '../models/message.model.js'
import {Chat} from '../models/chat.model.js'
import {User} from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'

const sendMessage = (asyncHandler(async(req,res)=>{
    const {chatId,content} = req.body
        const findChat = await Chat.findById(chatId)
        if(!findChat){
            throw new ApiError(404,"Chat not found")
        }
        if(!findChat.participants.some((p)=>p.equals(req.user._id))){
            throw new ApiError(403,"You are not a participant of this chat")
        }
        let attachmentURL
        if(req.file){
           const uploadResult = await uploadOnCloudinary(req.file.path)
           attachmentURL = uploadResult?.url;
        }
           const message = await Message.create({
            sender:req.user._id,
            content,
            attachment:attachmentURL,
            chat:chatId,
           })
           await Chat.findByIdAndUpdate(chatId,{latestMessage:message._id})

            return res
            .status(201)
            .json(new ApiResponse(201, message,"Message sent successfully"))
        
}))

const getMessages=(asyncHandler(async(req,res)=>{
    const {chatId} = req.query;
    if(!chatId || chatId.trim()===""){
        throw new ApiError(400,"Chat ID is required")
    }
    const findChat = await Chat.findById(chatId)
    if(!findChat){
        throw new ApiError(404, "Chat not Found")
    }
    if(!findChat.participants.includes(req.user._id)){
        throw new ApiError(403,"You are not the participant of this chat")
    }

    const message = await Message.find({chat:chatId}).populate("sender", "-password -refreshToken").sort({createdAt:1})
    if(!message){
        throw new ApiError(404,"No messages found for this chat")
    }
return res
.status(200)
.json(new ApiResponse(200,message,"Messages retrieved Successfully"))
}))

export{
    sendMessage,
    getMessages,
}