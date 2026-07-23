import {Router} from 'express'
import {accessChat,getUserChats,createGroupChat} from '../controllers/chat.controller.js'
import {createGroupChatValidator} from '../validators/chat.validator.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import validate from '../middlewares/validate.middleware.js'

const router = Router()

router.route('/accessChat').post(verifyJWT,accessChat)
router.route('/getUserChats').get(verifyJWT,getUserChats)

export default router