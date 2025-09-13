import express from 'express'
const router = express.Router()
import chatController from '../controllers/chat.controller.js'


router.post('/gemini',chatController.geminiApiCallController)
router.post('/openai',chatController.openaiApiCallController)
router.post('/llama',chatController.llamaApiCallController)

export default router
