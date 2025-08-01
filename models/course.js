import mongoose from 'mongoose';

const SubModuleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const ModuleSchema = new mongoose.Schema({
  title: String,
  subModules: [SubModuleSchema]
});

const CourseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true
  },
  prompt: {
    type: String,
    required: true
  },
  modules: [ModuleSchema],
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CourseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);

