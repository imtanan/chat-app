import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler'
import {User} from '../models/user.model'
import {ApiError} from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import {v2 as cloudinary} from "cloudinary"
import {uploadOnCloudinary} from '../utils/cloudinary'
import mongoose from 'mongoose'
import { use } from 'react'
const generateAccessAndRefreshTokens=async(userId)=>{
   try{
        console.log("ACCESS SECRET:", process.env.ACCESS_TOKEN_SECRET);
    console.log("REFRESH SECRET:", process.env.REFRESH_TOKEN_SECRET);
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
      console.log("Token Error", error)
      throw new ApiError(500, "Something went wrong while generating access and refresh token")
   }
}

const registerUser = asyncHandler(async(req,res)=>{      
      //show already exist message if already exists
      // save data otherwise in the db 
      //remove password from the response
      //check for user creation
      // return the response.

      const {username, email, password} = req.body;
      console.log("email", email);

    
     const existedUser = await User.findOne({
      $or : [{username}, {email}],
     });
   if(existedUser){
      throw new ApiError(409, "User with email or username already exists")
   }
   const avatarLocalPath = req.file?.path;
   if(!avatarLocalPath){
      throw new ApiError(400, "Avatar is required")
   }
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   if(!avatar){
      throw new ApiError(500, "Something went wrong while uploading the avatar")
   }
   const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      avatar: avatar.url,
      avatarPublicId: avatar.public_id,

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
      $or:[{username},{email}]
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
    const removeOldAvatar = await cloudinary.uploader.destroy(getAvatarPublicId)
  if(removeOldAvatar.result !== "ok"){
   console.log("Unable to remove the old  avatar from cloudinary")
  }
   }
   res
   .status(200)
   .json(new ApiResponse(200, user, "Avatar has been Updated Successfully"))
}))

const getCurrentUser = (asyncHandler(async(req,res)=>{
return res
.status(200)
.json(new ApiResponse(200,req.user,"User fetched Successfully"))
}))
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
}