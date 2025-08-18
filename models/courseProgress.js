import mongoose from 'mongoose'
import { type } from 'os'
import { ref } from 'process'

const progressSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    progress:{
        type:Number,
        default:0
    },
    completed:{
        type:Boolean,
        default:false
    },
    lastAccessed:{
        type:Date,
        default:Date.now
    },
    completedAt:{
        type:Date,
        default:null
    }
},{timestamps:true})

export default mongoose.models.CourseProgress || mongoose.model('CourseProgress',progressSchema)


