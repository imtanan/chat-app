const {body} = require("express-validator");

export const loginValidator= [
    body('email')
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
    body('password')
    .trim()
    .notEmpty().withMessage("Password is required")
    
    ]


