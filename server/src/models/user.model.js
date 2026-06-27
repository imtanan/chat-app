import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        lowercase:true,
        trim: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        
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
export const User = mongoose.model("User", userSchema)