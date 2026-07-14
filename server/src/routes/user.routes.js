import {Router} from 'express'
import{
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    getCurrentUser,
    searchUsers
} from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import validate from '../middlewares/validate.middleware.js'
import {loginValidator,registerValidator, updateAccountValidator,changePasswordValidator} from '../validators/user.validator.js'

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
router.route('/search').get(verifyJWT,searchUsers)

export default router