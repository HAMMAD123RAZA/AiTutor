import mongoose from 'mongoose';
import { type } from 'os';
import { v4 as uuidv4 } from 'uuid';


const CertificateSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },

    certificateId: {
    type: String,
    required: true,
    unique: true,
  default: () => uuidv4(),
  },

  userName:{
    type:String,
  },
  userEmail:{
    type:String,
  },
  completionDate:{
    type:Date,
    default:Date.now
  },
  
  courseName:{
    type:String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },

    userId: {
        type: String,
        required: true
    }
});

CertificateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);

