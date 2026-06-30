import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler'
import {User} from '../models/user.model'
import {ApiError} from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
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

      if([username,email,password].some((field)=>field?.trim() === "")){ //.some means if any one of the given item satisfies the condition
            throw new ApiError(400,"All fields are required")
      }
     const existedUser = await User.findOne({
      $or : [{username}, {email}],
     });
   if(existedUser){
      throw new ApiError(409, "User with email or username already exists")
   }
   const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
})
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   if(!createdUser){
      throw new ApiError(500,"Something went wrong while registering the user");
   }

   return 
   res
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

     const isPasswordValid = await User.isPasswordCorrect(password)
    if(!isPasswordValid){
      throw new ApiError(401, "Incorrect password")
    }
    const{accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select(
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
      201,
      {
         user:loggedInUser,
         accessToken,
         refreshToken,
      }, 
      "User logged In successfully"))
})

const logoutUser = asyncHandler(async(req,res)=>{
   const userId = await User.findById(user._id)
   const user = await User.findByIdAndUpdate(
      userId,
      {
         refreshToken:undefined
      }
   )
})
export {
      registerUser,
      loginUser
      
}