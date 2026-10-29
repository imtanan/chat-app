import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Chat } from '../models/chat.model.js'
import {v2 as cloudinary} from "cloudinary"
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { sendEmail } from '../utils/sendEmail.js'
import fs from 'fs';
import crypto from 'crypto'
import mongoose from 'mongoose'

const generateAccessAndRefreshTokens=async(userId)=>{
   try{
       
    const user = await User.findById(userId)
    if(!user){
      throw new ApiError(404, "User not found for token generation")
    }
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({
      validateBeforeSave: false
    })
    return {accessToken, refreshToken}
   }catch(error){
      
      throw new ApiError(500, "Something went wrong while generating access and refresh token")
   }
}

const registerUser = asyncHandler(async(req,res)=>{      
      //show already exist message if already exists
      // save data otherwise in the db 
      //remove password from the response
      //check for user creation
      // return the response.

      const {username, password} = req.body;
      const email = req.body.email.toLowerCase().trim()
      


    
     const existedUser = await User.findOne({
      $or : [{username}, {email}],
     });
     
   if(existedUser){
      if(req.file?.path){
         fs.unlinkSync(req.file.path)
      }
      throw new ApiError(409, "Email or username already exists.")
   }
   let avatarUrl;
   let avatarPublicId=null;
   if(req.file?.path){
      const avatar = await uploadOnCloudinary(req.file.path)
      if(!avatar){
         throw new ApiError(500, "Something went wrong while uploading the avatar")
      }
    avatarUrl = avatar.url;
    avatarPublicId = avatar.public_id;
   }
    else{
       avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
    }


   
  
   const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      avatar: avatarUrl,
      avatarPublicId,

})
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   if(!createdUser){
      throw new ApiError(500,"Something went wrong while registering the user");
   }

   return res
   .status(201)
   .json(new ApiResponse(200,createdUser, "User registered Successfully"));
})

const loginUser = asyncHandler(async(req,res)=>{
     //take data from user  
     //Check if the data exists in the db
     //Show error if it does not appear 
     //give user accessToken otherwise
     //Redirect them to the Home Page
     //In case of refresh token, also give user the refresh Token periodically

     const {email, password} = req.body
     const user = await User.findOne({email})
     if(!user){
      throw new ApiError(401, "This email is not registered")
     }

     const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
      throw new ApiError(401, "Incorrect password")
    }
    const{accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user?._id).select(
      "-password -refreshToken"
    )
    const options={
      httpOnly: true,
      secure:true,
    }
    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(
      200,
      {
         user:loggedInUser,
         accessToken,
         refreshToken,
      }, 
      "User logged In successfully"))
})

const logoutUser = asyncHandler(async(req,res)=>{
   
   await User.findByIdAndUpdate(
      req.user._id,
      {
     $unset: {
         refreshToken:1
      },
   },
        {
         new:true
        }
   )
   const options={
      httpOnly:true,
      secure:true,
   };
   res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {},"User Logged Out"))
})

const refreshAccessToken = (asyncHandler(async(req,res)=>{
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken ;
if(!incomingRefreshToken){
  throw new ApiError(401, "Unauthorized request")
}
try{
const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

const user = await User.findById(decodedToken?._id);
if(!user){
   throw new ApiError(401, "The token is expired or the user does not exists")
}
if(incomingRefreshToken !== user?.refreshToken){
    throw new ApiError(401, "Refresh token is expired or used")
}
const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user?._id)

const options = {
   httpOnly: true,
   secure: true,
}
return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
   new ApiResponse(200,{
      accessToken,
      refreshToken,
   },"Access Token has been refreshed")
)
}catch(error){

throw new ApiError(401,error?.message,"Invalid refresh Token") //error.message shows jwt verify's built-in messages like jwt expired or invalid signature etc.
}





}))

const changeCurrentPassword = (asyncHandler(async(req,res)=>{

  const {oldPassword,newPassword} = req.body
  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
      throw new ApiError(400,"Old Password is incorrect")
  }
   user.password = newPassword
   await user.save({
      validateBeforeSave: false
   })
   return res
   .status(200)
   .json(new ApiResponse(200, {}, "Password Changed Successfully"))
}))
//Requires email validator below
const updateAccountDetails = (asyncHandler(async(req,res)=>{
   //take three things from user
   //make sure if they are same or changed
   //if any or all of them changed just save them into the user's db
   //send response with updated data
   const {username,email} = req.body
   const existedUser = await User.findOne({
      $or:[{username},{email}], _id:{$ne:req.user?._id}
   })
if(existedUser){
   throw new ApiError(409, "User with this username or email already exists")
}
try{
   
const updatedUser = await User.findByIdAndUpdate(
   req.user?._id,
   {
      $set: {  
      username: username || req.user?.username,
      email: email || req.user?.email,
   },
   },
   { new: true }
) .select("-password -refreshToken")
 return res
 .status(200)
 .json(new ApiResponse(200, updatedUser, "Account details updated successfully"))
}catch(error){
   throw new ApiError(500, error?.message || "Something went wrong while updating the account details")
}
}))

const updateUserAvatar = (asyncHandler(async(req,res)=>{
   const getAvatarPublicId = req.user?.avatarPublicId
   const avatarLocalPath = req.file?.path;
   if(!avatarLocalPath){
      throw new ApiError(400, "Avatar is required")
   }
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   if(!avatar){
      throw new ApiError(500, "Something went wrong while uploading the avatar")
   }
   const user = await User.findByIdAndUpdate(
      req.user?._id,
     { 
    $set:  {
         avatar:avatar.url,
         avatarPublicId: avatar.public_id
      },
   },
     {
       new: true
      }
   ).select(
      "-password"
   )
   
   if(!user){
      throw new ApiError(500, "Something went wrong while updating the avatar")
   }
   if(getAvatarPublicId){
       try {
    const removeOldAvatar = await cloudinary.uploader.destroy(getAvatarPublicId)
  if(removeOldAvatar.result !== "ok"){
   console.log("Unable to remove the old  avatar from cloudinary")
  }
}  catch (err) {
    console.log("Cloudinary cleanup failed:", err.message)
  }
   }
   res
   .status(200)
   .json(new ApiResponse(200, user, "Avatar has been Updated Successfully"))
}))

// chat.controller.js
const updateGroupAvatar = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId);

  if (!chat) throw new ApiError(404, "Group not found");
  if (!chat.isGroupChat) throw new ApiError(400, "Not a group chat");

  // Since "anyone can change" — no admin check here (unlike rename/remove)
  if (!chat.participants.some(p => p.equals(req.user._id))) {
    throw new ApiError(403, "You're not a member of this group");
  }
  const avatarLocalPath = req.file?.path;
  
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  
  if (!avatar?.url) throw new ApiError(500, "Failed to upload avatar");

  // cleanup old avatar (non-critical, same pattern as your user avatar)
  if (chat.avatarPublicId) {
    cloudinary.uploader.destroy(chat.avatarPublicId).catch(err => console.log(err));
  }

  chat.avatar = avatar.url;
  chat.avatarPublicId = avatar.public_id;
  await chat.save();

  const io = req.app.get('io');
  const onlineUsers = req.app.get('onlineUsers');
  if (io && onlineUsers) {
  chat.participants.forEach((userId) => {
     const socketId = onlineUsers.get(userId.toString());
    if (socketId) io.to(socketId).emit('groupAvatarUpdated', { chatId, avatar: chat.avatar });
  });
}

await chat.populate([{path:'participants', select: '-password'},{path: 'groupAdmin', select: '-password'}])

  return res.status(200).json(new ApiResponse(200, chat, "Group avatar updated successfully"));
});

const getCurrentUser = (asyncHandler(async(req,res)=>{
return res
.status(200)
.json(new ApiResponse(200,req.user,"User fetched Successfully"))
}))

const searchUsers=(asyncHandler(async(req,res)=>{
   const {search} = req.query
   if(!search || search.trim() === ""){
     throw new ApiError(400, "Search query is required")
   }
   const users = await User.find({
      $and:[
         {_id:{$ne:req.user._id}},
         {
     $or:[
      {username:{$regex:search, $options:"i"}},
      {email:{$regex:search, $options:"i"}}
     ]
   }
   ]
   }).select("-password -refreshToken")
   if(users.length === 0){
      return res
      .status(200)
      .json(new ApiResponse(200, [], "No users found"))
   }
   return res
   .status(200)
   .json(new ApiResponse(200, users, "Users found successfully"))
}))

const forgotPassword = (asyncHandler(async(req,res)=>{
     
   const email = req.body.email.toLowerCase().trim()
   const user = await User.findOne({email})
      
   if(!user){
       return res.status(200).json(new ApiResponse(200, null, "If an account exists, we sent a   link"))

   }
   const token = await user.generateResetToken()
    
   try{
   await sendEmail({
      to:user.email,
      subject: 'Reset your password',
      html: `<p>Click the link to reset your password:</p>
       <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset password</a>
       <p style="color:#888;font-size:12px">This link expires in 15 minutes. Requested at ${new Date().toLocaleTimeString()}.</p>`
   })
    
}catch{
   user.resetTokenHash=undefined,
   user.resetTokenExpiry=undefined,
   await user.save({ validateBeforeSave: false })
  throw new ApiError(500, "Could not send the reset email. Try again later.")
}

return res.status(200).json(new ApiResponse(200, null, "If an account exists, we sent a reset link"))
}))
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params
  const { password, confirmPassword } = req.body

  if (!password || password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match")
  }

  // hash the token from the URL the same way it was hashed when it was created
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    resetTokenHash: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },   // still valid
  })

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or has expired")
  }

  user.password = password            // plain text: your pre('save') hook hashes it
  user.resetTokenHash = undefined     // single use
  user.resetTokenExpiry = undefined
  user.refreshToken = undefined       // log out other sessions
  await user.save()

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successful. Please log in."))
})

export {
      registerUser,
      loginUser,
      logoutUser,
      generateAccessAndRefreshTokens,
      refreshAccessToken,
      changeCurrentPassword,
      getCurrentUser,
      updateAccountDetails,
      updateUserAvatar,
      updateGroupAvatar,
      searchUsers,
      forgotPassword,
      resetPassword,
}