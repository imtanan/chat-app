import {Router} from 'express'
import{
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    getCurrentUser
} from '../controllers/user.controller'
import {upload} from '../middlewares/multer.middleware'
import {verifyJWT} from '../middlewares/auth.middleware'
import {validate} from '../middlewares/validate.middleware'
import {loginValidator,registerValidator, updateAccountValidator} from '../validators/user.validator'

const router = Router()
router.route('/register').post(
    upload.single("avatar"),
    registerValidator,
    validate,
registerUser
)
router.route('/login').post(loginValidator,validate,loginUser)
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').post(verifyJWT,changePasswordValidator,validate,changeCurrentPassword)
router.route('/current-user').get(verifyJWT,getCurrentUser)
router.route('/update-account').patch(verifyJWT,updateAccountValidator,validate,updateAccountDetails)
router.route('/avatar').patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
