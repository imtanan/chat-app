import {Router} from 'express'
import{
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateGroupAvatar,
    getCurrentUser,
    searchUsers,
    forgotPassword,
    resetPassword,
} from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import validate from '../middlewares/validate.middleware.js'
import {loginValidator,registerValidator, updateAccountValidator,changePasswordValidator,forgotPasswordValidator,resetPasswordValidator} from '../validators/user.validator.js'

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
router.route('/group-avatar/:chatId').patch(verifyJWT,upload.single("avatar"),updateGroupAvatar)
router.route('/search').get(verifyJWT,searchUsers)
router.route('/forgot-password').post(forgotPasswordValidator, validate, forgotPassword)
router.route('/reset-password/:token').post(resetPasswordValidator, validate, resetPassword)

export default router