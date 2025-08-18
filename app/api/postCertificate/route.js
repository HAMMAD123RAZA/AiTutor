import dbconnect from '../../../lib/dbConn'
import certificate from '../../../models/certificate';

export const POST = async(req)=>{
    await dbconnect()
        const body = await req.json();
try {
    const {courseId,userId,userName,userEmail,courseName}=body
    const newCertificate=new certificate({
        courseId,
        userId,
        userName,
        userEmail,
        courseName
    })
const savedCertificate = await newCertificate.save();
console.log('Certificate created:', savedCertificate);

return new Response(
    JSON.stringify({
        message: "Certificate created successfully",
        certificate: savedCertificate,
        certificateId: savedCertificate.certificateId // assuming MongoDB
    }), 
    {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    }
);
} catch (error) {
    console.log('err creating cert:',error)
    return new Response(JSON.stringify({message:"error creating cert"}), {status:500})
}
}