import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma.js'
import AppError from '../../utils/AppError.js'

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

export {
    registerService,
    loginService
}