import { body } from "express-validator";

export const loginValidator= [
    body('email')
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
    body('password')
    .trim()
    .notEmpty().withMessage("Password is required")
    
    ]
    export const registerValidator= [
        body('username')
        .trim()
        .notEmpty().withMessage("Username is required"),
        body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
        body('password')
        .trim()
        .notEmpty().withMessage("Password is required"),
    ]
    export const updateAccountValidator= [
        body('username')
        .optional({values: 'falsy'})
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
        body('email')
      .optional({ values: 'falsy' })
      .trim()
      .isEmail().withMessage("Invalid email format"),
        
    ]

export const changePasswordValidator= [
  body('oldPassword')
  .trim()
  .notEmpty().withMessage("Old Password is required"),
    body('newPassword')
    .trim()
    .notEmpty().withMessage("New Password is required")  
]

