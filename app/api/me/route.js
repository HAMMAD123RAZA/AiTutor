// /api/me/route.js
import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/dbConn';
import User from '../../../models/Users.js';
const secretKey=`${process.env.secretKey}`;

export async function GET(req) {
  const token = req.cookies?.get('token')?.value;
  console.log('token cookie:me:',token)

  if (!token) return Response.json({ user: null }, { status: 401 });

  try {
    const decoded = jwt.verify(token, secretKey);
    await dbConnect();
    // const user = await User.findById(decoded.id).select('-password');
    const user = await User.findOne({ email: decoded.email }).select('-password');

    console.log('user from me:', user)
    return Response.json({ user });
  } catch (err) {
    return Response.json({ user: null }, { status: 401 },{meessage:err});
  }
}


