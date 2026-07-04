import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    avatar: {
        type: String,//cloudinary url
        default: ""
    },
    username:{
        type: String,
        required: true,
        lowercase:true,
        trim: true,
        unique: true,
    },
    email:{
        type: String,
        required: [true, "Gmail is required"],
        unique: true,
        lowercase:true,
        trim:true,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        
    }, 
     refreshToken: {
      type: String,
    },

},
{
    timestamps:true,
}
);
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await  bcrypt.compare(password,this.password)
}
//access+refresh Token here
//write this method in the schema to use it later as it generates a special kind of signature so token can be verified as authentic as it identifies and expires automatically

userSchema.methods.generateAccessToken =function(){
   return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
   );
};

userSchema.methods.generateRefreshToken = function(){
return jwt.sign(
    {
        _id:this._id,
      
    },process.env.REFRESH_TOKEN_SECRET , {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User = mongoose.model("User", userSchema)