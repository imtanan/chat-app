import mongoose, {Schema} from 'mongoose'

const chatSchema = new Schema({
    chatName:{
        type: String,
      trim:true,
      //Meaningful only when isGroupChat is true
    },
    isGroupChat:{
        type:Boolean,
        default: false,
    },
    participants:[
    {
    type: Schema.Types.ObjectId,
    ref:"User",
    
    },
],
    groupAdmin:{
     type:Schema.Types.ObjectId,
     ref:"User",
     //only set when isGroupChat is true
    },
    latestMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message"
    }

},
   {timestamps:true}
)

export const Chat = mongoose.model("Chat",chatSchema)