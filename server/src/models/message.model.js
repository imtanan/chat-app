import mongoose, {Schema} from 'mongoose'

const messageSchema = new Schema({
     sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true,
     },
     content:{
        type: String,
        trim:true,
        required:function(){
         return !this.attachment
        },
     },
     attachment:{
       type: String,//cloudinary url
     },
     chat:{
        type:Schema.Types.ObjectId,
        ref:"Chat",
        required:true,
     },
},
{timestamps:true}
)

export const Message = mongoose.model("Message", messageSchema)