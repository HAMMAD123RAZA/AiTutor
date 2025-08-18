import dbConnect from '../../../lib/dbConn'
import courseProgress from "../../../models/courseProgress";

export async function POST(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const body = await req.json();
    
    try {
        if (action === 'find') {
            // Handle find operation
            const { userId, courseId } = body;
            const progress = await courseProgress.findOne({ userId, courseId });
            
            if (!progress) {
                return Response.json(
                    { error: "Progress not found" },
                    { status: 404 }
                );
            }

            return Response.json({
                progress: progress?.progress,
                completed: progress?.completed,
                lastAccessed: progress?.lastAccessed
            });
        } 
        else if (action === 'update') {
            // Handle update operation
            const { userId, courseId, progress: newProgress } = body;
            
            if (typeof newProgress !== 'number' || newProgress < 0 || newProgress > 100) {
                return Response.json(
                    { error: "Invalid progress value" },
                    { status: 400 }
                );
            }

            // Find and update the progress, or create if it doesn't exist
            const updatedProgress = await courseProgress.findOneAndUpdate(
                { userId, courseId },
                { 
                    $set: { 
                        progress: newProgress,
                        lastAccessed: new Date(),
                        // Mark as completed if progress is 100
                        completed: newProgress === 100 
                    } 
                },
                { new: true, upsert: true }
            );

            return Response.json({
                success: true,
                progress: updatedProgress.progress,
                completed: updatedProgress.completed,
                lastAccessed: updatedProgress.lastAccessed
            });
        } 
        else {
            return Response.json(
                { error: "Invalid action specified" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return Response.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}