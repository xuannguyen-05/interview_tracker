import express from 'express';
import validate from '../../middlewares/validate.middleware.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    googleLoginSchema
} from './auth.schema.js';
import {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    googleLogin,
    getMe
} from './auth.controller.js';

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

router.post("/google", validate(googleLoginSchema), googleLogin);

router.get("/me", authMiddleware, getMe);

export default router;
