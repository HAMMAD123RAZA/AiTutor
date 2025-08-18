import bcrypt from 'bcryptjs'
import Users from '../../../models/Users.js'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/dbConn.js'
import { cookies } from 'next/headers'; // if using app router


const secretKey=`${process.env.secretKey}`;

export async function POST(req) {
  try {
    await dbConnect()

    const body = await req.json()
    const { email, password, name, action } = body

    if (action === 'register') {
      const existingUser = await Users.findOne({ email })
      if (existingUser) {
        // Return with proper 409 status code
        return Response.json(
          { message: "User already exists" }, 
          { status: 409 }
        )
      }

      const hashPassword = await bcrypt.hash(password, 10)
      const newUser = new Users({ name, email, password: hashPassword })
      const savedUser = await newUser.save()
      const token = jwt.sign({ email }, secretKey, { expiresIn: '7d' })

      return Response.json({
        message: "User registered successfully",
        token,
        user: savedUser
      }, { status: 201 })
    }

    if (action === 'login') {
      const user = await Users.findOne({ email })
      if (!user) {
        return Response.json(
          { message: "User not found" }, 
          { status: 404 }
        )
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return Response.json(
          { message: "Incorrect password" }, 
          { status: 401 }
        )
      }

      const token = jwt.sign({id: user._id, email }, secretKey, { expiresIn: '7d' })

      cookies().set('token', token,{
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict',
        path: '/'
      })

      return Response.json({
        message: "User logged in successfully",
        token,
        user
      }, { status: 200 })
    }

    return Response.json(
      { message: "Invalid action" }, 
      { status: 400 }
    )

  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { message: "Internal server error" }, 
      { status: 500 }
    )
  }
}
