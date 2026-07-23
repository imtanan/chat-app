import {body} from 'express-validator';
import mongoose from 'mongoose';

export const createGroupChatValidator =[
    body("chatName")
    .trim()
    .isEmpty()
    .withMessage("Group Chat name is required"),
    body('participants')
    .isArray({min:2})
    .withMessage("At least 2 participants are required to create a group chat")
    .custom((arr) => arr.every((id) => mongoose.Types.ObjectId.isValid(id)))
    .withMessage("All participants must be valid user IDs"),
]