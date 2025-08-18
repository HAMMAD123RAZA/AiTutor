import dbConnect from "../../../lib/dbConn";
import course from "../../../models/course";
import courseProgress from "../../../models/courseProgress";
import { courseCreatedUsage } from "../../../utils/Operations";

export async function POST(req) {
    await dbConnect()
    try {
        const {prompt, userId,user} = await req.json();
        const userEmail=user?.email
        if (!prompt) {
            return Response.json(
                {error: "Prompt is required"},
                {status: 400}
            )
        }

        // Find courses with similar prompts
        const courses = await course.find({
            prompt: {$regex: prompt, $options: 'i'}
        });

        if (!courses || courses.length === 0) {
            return Response.json(
                {error: "No courses found with this prompt"},
                {status: 404}
            )
        }

           
        // For each found course, check/create progress document
     const coursesWithProgress = await Promise.all(
  courses.map(async (course) => {
    // Tracking code here
    const generatedAt = new Date()
    const type = 'Db'

  
const tracking = await courseCreatedUsage(
  userId,
  userEmail,
  course._id.toString(),
  generatedAt,
  prompt,
  type
)
console.log('tracking called:',tracking)
    // Check if progress already exists
    const existingProgress = await courseProgress.findOne({
      userId: userId,
      courseId: course._id
    });

    if (!existingProgress) {
      const newProgress = new courseProgress({
        userId: userId,
        courseId: course._id,
        progress: 0,
        completed: false,
        lastAccessed: new Date()
      });
      await newProgress.save();
    }

    return course
  })
)


        return Response.json(coursesWithProgress)
    } catch (error) {
        console.log('Error in searching by prompt:', error)
        return Response.json(
            {error: "Failed to search courses by prompt"},
            {status: 500}
        )
    }
}