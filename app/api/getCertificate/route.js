import dbconnect from '../../../lib/dbConn'
import certificate from '../../../models/certificate';

export const POST = async(req)=>{
    await dbconnect()
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const body=await req.json()
try {
    if(action==='find'){
    const {certificateId}=body
    const data=await certificate.findOne({certificateId:certificateId})
    console.log('data:',data)
    return new Response(JSON.stringify({data}),{status:200})
    }
    else if(action==='all'){
        const {userId}=body
        const data=await certificate.find({userId:userId})
        console.log('data:', data)
        return new Response(JSON.stringify({data}), {status:200})
    }
    else{
        return new Response(JSON.stringify({message:"invalid action"}), {status:400})
    }

} catch (error) {
    console.log('err getting cert:',error)
    return new Response(JSON.stringify({message:"error getting cert"}), {status:500})
}
}
