import Users from '../../../models/Users'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import dbConnect from '../../../lib/dbConn'
import { NextResponse } from 'next/server'


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.user, 
    pass:process.env.pass 
  }
});

export const POST =async(req)=>{
    await dbConnect()
    const {searchParams}=new URL(req.url)
    const action=searchParams.get('action')
    
    if (!action=='send'){
      return Response.json({status:400,message:"Invalid action"})
    }
    
    const body = await req.json()
    const {email} = body

    try {
          const user=await Users.findOne({email})
    if(!user){
        return Response.json({status:404,message:"User not found"})
    }

    const verificationToken=crypto.randomBytes(20).toString('hex')
    const verfiyExpiry=new Date(Date.now()+3600000)
    const verificationUrl=`http://localhost:3000/api/Send_Email_AndVerify?action=verify&token=${verificationToken}`

    // this one updating that user document token and expiry
    const updateDoc=await Users.updateOne({ email }, { $set: { verificationToken, verfiyExpiry } });
    if(!updateDoc){
        return Response.json({status:501, message:"Failed to update user"})
    }
    else{
        console.log("User updated successfully")
        // return Response.json({status:201, message:"User updated successfully"})
    }

     const mailOptions = {
      from: '01hammadraza@gmail.com',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Email Verification</h1>
        <p>Hi ${user?.name},</p>
        <p>Thanks for registering! Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    };
    await transporter.sendMail(mailOptions)
    return Response.json({status:201,message:"Sent link successfully"})
    } catch (error) {
        console.error(error)
        return Response.json({status:501,message:`err occured ${error}`})
    }
}



//verifying emai 



export async function GET(req) {
  await dbConnect()
  const {searchParams}=new URL(req.url)
  const action=searchParams.get('action')
  
  if (!action=='verify'){
    return Response.json({status:400,message:"Invalid action"})
  }
  

  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 })
  }

  try {
    const user = await Users.findOne({ verificationToken: token })

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 404 })
    }

    if (user.verfiyExpiry < Date.now()) {
      return NextResponse.json({ message: 'Token has expired' }, { status: 400 })
    }

    user.isVerified = true
    user.verificationToken = null
    user.verfiyExpiry = null

    await user.save()

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

