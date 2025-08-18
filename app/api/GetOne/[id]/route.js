import { useUser } from "../../../../context/UserContext";
import dbConnect from "../../../../lib/dbConn";
import course from "../../../../models/course";


export async function GET(req, { params }) {

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
const userId = searchParams.get('userId'); // ✅ Get userId here

  if (!action) {
    return Response.json({ status: 400, message: "Missing action parameter" });
  }

  try {
    if (action === 'one') {
      const courseOne = await course.findById(params.id);
      if (!courseOne) {
        return Response.json({ error: 'Course not found' }, { status: 404 });
      }

       if (!courseOne?.userIds?.includes(userId)) {
    await course.updateOne(
      { _id: params.id },
      { $addToSet: { userIds: userId } } // Prevents duplicates
    );
  }

      return Response.json(courseOne);
    }

    if (action === 'all') {
      const userId = params?.id;
//       const courses = await course.find({
//   userIds: { $in: [new mongoose.Types.ObjectId(userId)] }
// });
      const courses = await course.find({ userIds:{$in:[userId]} });
      return Response.json(courses);
    }

    // Invalid action fallback
    return Response.json({ status: 400, message: "Invalid action" });

  } catch (error) {
    console.error('Error in GET handler:', error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
