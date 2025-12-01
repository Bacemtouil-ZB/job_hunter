import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: String,
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  }],
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  }],
  role: {
    type: String,
    enum: ["jobseeker", "recruiter"],
    default: "jobseeker"
  },
  resume: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
    default: "No bio provided",
  },
  profession: {
    type: String,
    default: "Unemployed",
  },
  phone: String,
  location: String,
  
  // Job seeker specific fields
  skills: [String],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  
  // Recruiter specific fields
  companyName: String,
  companyDescription: String,
  companySize: String,
  industry: String,
  website: String,
}, 
{ timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;