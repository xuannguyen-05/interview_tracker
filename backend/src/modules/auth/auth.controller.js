import {registerService, loginService, forgotPasswordService, resetPasswordService} from './auth.service.js'
import asyncHandler from '../../utils/asyncHandler.js'


const register = asyncHandler(async(req, res) => {

    const user = await registerService(req.body)

    res.status(201).json({
        message: "Register success", 
        data: user
    }) 
})

const login = asyncHandler(async(req, res) => {

    const {user, accessToken } = await loginService(req.body)

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    })


    // Trả về user và accessToken trong body để frontend JS có thể lấy token khi cần.
    res.status(200).json({
        message: "Login success",
        data: {
            user,
            accessToken
        }
    })
})

const logout = (req, res) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    })

    res.status(200).json({
        message: "Logout success"
    })

}

const forgotPassword = asyncHandler(async (req, res) => {
    await forgotPasswordService(req.body.email);

    res.status(200).json({
        success: true,
        message:
        "If an account with that email exists, a password reset link has been sent.",
    });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  await resetPasswordService(token, password);

  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
});

export {register, login, logout, forgotPassword, resetPassword}


