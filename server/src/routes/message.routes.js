import {Router} from 'express'
import {sendMessage,getMessages} from '../controllers/message.controller.js'
import {sendMessageValidator} from '../validators/message.validator.js'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import validate from '../middlewares/validate.middleware.js'

const router = Router()
router.route('/send').post(verifyJWT,upload.single("attachment"),sendMessageValidator,validate,sendMessage)
router.route('/get').get(verifyJWT,getMessages)

export default router