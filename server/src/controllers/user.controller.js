import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler'
import {User} from '../models/user.model'
import ApiError from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import mongoose from 'mongoose'


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