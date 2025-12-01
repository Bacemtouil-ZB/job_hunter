import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";

const router = express.Router();

// GET applicants for a specific job
// Since server.js adds /api/v1/ prefix, this becomes: /api/v1/applicants/:jobId
router.get("/applicants/:jobId", asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  // Validate jobId
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid Job ID" });
  }

  // Find the job
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  // Find users whose _id is in job.applicants
  const applicants = await User.find({ _id: { $in: job.applicants } }).select("name email");

  res.json(applicants);
}));

export default router;