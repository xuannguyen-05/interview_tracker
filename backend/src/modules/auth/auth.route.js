import express from 'express'
import validate from '../../middlewares/validate.middleware.js'
import {registerSchema, loginSchema} from './auth.schema.js'
import {register, login, logout} from './auth.controller.js'

const router = express.Router();


router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/logout", logout)

export default router