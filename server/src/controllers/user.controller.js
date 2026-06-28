import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler'
import {User} from '../models/user.model'
import ApiError from '../utils/ApiError'


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
   
})