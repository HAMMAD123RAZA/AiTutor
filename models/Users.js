
import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
        verificationToken: {
        type: String,
        default: null
    },
    verfiyExpiry: {
        type: Date,
        default: null
    },
      isVerified: { type: Boolean, default: false },

  

}, { timestamps: true })

export default mongoose.models.Users ||  mongoose.model('Users',userSchema)
