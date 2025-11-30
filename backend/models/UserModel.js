import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String }
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String }
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
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
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
  
  // Common fields
  phone: { type: String },
  location: { type: String },
  
  // Jobseeker-specific fields
  skills: [{ type: String }],
  experience: [experienceSchema],
  education: [educationSchema],
  
  // Recruiter-specific fields
  companyName: { type: String },
  companyDescription: { type: String },
  companySize: { 
    type: String,
    enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
  },
  industry: { type: String },
  website: { type: String },
  
  // Profile completion tracking
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, 
{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;