import {body} from 'express-validator';
import mongoose from 'mongoose';

export const createGroupChatValidator = [
    body("chatName")
        .trim()
        .notEmpty()
        .withMessage("Group chat name is required"),

    body("participants")
        .isArray({ min: 2 })
        .withMessage("At least 2 participants are required")
        .custom((participants) => {
            if (!Array.isArray(participants)) return false;

            return participants.every((id) =>
                mongoose.Types.ObjectId.isValid(id)
            );
        })
        .withMessage("All participants must be valid user IDs"),
];

export const renameGroupValidator = [
    body("chatName")
    .trim()
    .notEmpty()
    .withMessage("Group Chat name is required"),
]
export const addToGroupValidator = [
    body("userId")
    .trim()
    .notEmpty()
    .withMessage("User ID is required")
    .custom((id) => mongoose.Types.ObjectId.isValid(id))
    .withMessage("User ID must be a valid user ID"),
]

export const removeFromGroupValidator = [
    body("userId")
    .trim()
    .notEmpty()
    .withMessage("User ID is required")
    .custom((id) => mongoose.Types.ObjectId.isValid(id))
    .withMessage("User ID must be a valid user ID"),
]