import {body} from "express-validator";
import mongoose from 'mongoose'

export const sendMessageValidator=[
    body("chatId")
    .notEmpty()
    .withMessage("Chat ID is required")
    .custom((id)=>mongoose.Types.ObjectId.isValid(id))
    .withMessage("Invalid Chat ID"),
    body("content")
    .optional()
    .trim(),
    body("attachment")
    .optional()
    .trim(),

    body().custom((body)=>{
        if(!body.content && !body.attachment){
            throw new Error("Message must be either content or an attachment")
        }
        return true;
    }),
    
];