import bcrypt from 'bcryptjs'
import Users from '../../../models/Users.js'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/dbConn.js'

export async function POST(req) {
        await dbConnect()

  const body = await req.json()
  const { email, password, name, action } = body

  if (action === 'register') {
    const existingUser = await Users.findOne({ email })
    if (existingUser) {
      return Response.json({ status: 409, message: "User already exists" })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = new Users({ name, email, password: hashPassword })
    const savedUser = await newUser.save()

    const token = jwt.sign({ email }, 'meriSecretKey', { expiresIn: '1h' })

    return Response.json({
      status: 201,
      message: "User registered successfully",
      token,
      user: savedUser
    })
  }

  if (action === 'login') {
    const user = await Users.findOne({ email })
    if (!user) {
      return Response.json({ status: 404, message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return Response.json({ status: 401, message: "Incorrect password" })
    }

    const token = jwt.sign({ email }, 'meriSecretKey', { expiresIn: '1h' })

    return Response.json({
      status: 200,
      message: "User logged in successfully",
      token,
      user
    })
  }

  return Response.json({ status: 400, message: "Invalid action" })
}

