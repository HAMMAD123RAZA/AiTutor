import dbConnect from "../../../lib/dbConn";
import course from "../../../models/course";


export async function POST(req) {
    await dbConnect()
    try {
        const {prompt} = await req.json(); // Get prompt from request body
        
        if (!prompt) {
            return Response.json(
                {error: "Prompt is required"},
                {status: 400}
            )
        }

        // Find courses with similar prompts
        const courseOne = await course.find({
            prompt: {$regex: prompt, $options: 'i'} // Case-insensitive search
        });

        if (!courseOne || courseOne.length === 0) {
            return Response.json(
                {error: "No courseOne found with this prompt"},
                {status: 404}
            )
        }

        return Response.json(courseOne)
    } catch (error) {
        console.log('Error in searching by prompt:', error)
        return Response.json(
            {error: "Failed to search courses by prompt"},
            {status: 500}
        )
    }
}

