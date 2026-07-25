import bcrypt from 'bcrypt'
import crypto from "crypto";
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma.js'
import AppError from '../../utils/AppError.js'
import { sendMail } from '../../services/mail.service.js';
import { resetPasswordTemplate } from '../../templates/resetPassword.template.js';

const registerService = async(data) => {
    const {full_name, email, password} = data

    const existingUser =  await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(existingUser){
        throw new AppError("Email already exists", 409, "EMAIL_EXISTS") 
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
        data: {
            full_name,
            email,
            password_hash: hashedPassword
        },
        select: {
            user_id: true,
            full_name: true
        }
    })

    return user
}

const loginService = async(data) => {
    const {email, password} = data

    const user =  await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(!user){
        throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS")
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
        throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS")
    }

    const accessToken = jwt.sign(
        {
            user_id: user.user_id
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    return {
        user: {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email
        },
        accessToken
    }
}

const forgotPasswordService = async(email) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(!email){
        return
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
        where: {
            user_id: user.user_id
        },
        data: {
            reset_password_token: hashedResetToken,
            reset_password_expires: expiresAt
        }
    });

    const resetLink =
    `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendMail({
        to: user.email,
        subject: "Reset your password",
        html: resetPasswordTemplate(resetLink)
    });
}

const resetPasswordService = async(token, password) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            reset_password_token: hashedToken,
        },
    });

    if (!user) {
        throw new AppError("Invalid or expired reset token.", 400, INVALID_RESET_TOKEN);
    }

    if (user.reset_password_expires < new Date()) {
        throw new AppError(
            "Reset token has expired.",
            400,
            "RESET_TOKEN_EXPIRED"
        );
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await prisma.user.update({
        where: {
            user_id: user.user_id,
        },
        data: {
            password_hash: hashedPassword,
            reset_password_token: null,
            reset_password_expires: null,
        },
    });
}

export {
    registerService,
    loginService,
    forgotPasswordService,
    resetPasswordService
}