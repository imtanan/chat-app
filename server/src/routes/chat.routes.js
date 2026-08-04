import {Router} from 'express'
import {accessChat,getUserChats,createGroupChat, renameGroup,
    addToGroup,
    removeFromGroup} from '../controllers/chat.controller.js'
import {createGroupChatValidator,renameGroupValidator,addToGroupValidator,removeFromGroupValidator} from '../validators/chat.validator.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import validate from '../middlewares/validate.middleware.js'

const router = Router()

router.route('/accessChat').post(verifyJWT,accessChat)
router.route('/getUserChats').get(verifyJWT,getUserChats)
router.route('/createGroupChat').post(verifyJWT,createGroupChatValidator,validate,createGroupChat)
router.route('/renameGroup/:chatId').put(verifyJWT,renameGroupValidator,validate,renameGroup)
router.route('/addToGroup/:chatId').put(verifyJWT,addToGroupValidator,validate,addToGroup)
router.route('/removeFromGroup/:chatId').put(verifyJWT,removeFromGroupValidator,validate,removeFromGroup)

export default router