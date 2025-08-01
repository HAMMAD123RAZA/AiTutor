import dbConnect from "../../../../lib/dbConn";
import course from "../../../../models/course";


export async function GET(req,{params}) {
    await dbConnect()
    try {
        const courseOne=await course.findById(params.id)
        if (!courseOne) {
            return Response.json({error:'couse n/a'},{status:404})
        }
        return Response.json(courseOne)
    } catch (error) {
        console.log('err in getting one:',error)
           return Response.json(
      { error: "Failed to fetch course" },
      { status: 500 }
           )
    }
}

