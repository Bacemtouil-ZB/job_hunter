import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";
//create job
export const createJob = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const isAuth = req.oidc.isAuthenticated() || user.email;
    if (!isAuth) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, description, location, salary, jobType, tags, skills, salaryType, negotiable } = req.body;

    // Validation
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });
    if (!location) return res.status(400).json({ message: "Location is required" });
    if (!salary) return res.status(400).json({ message: "Salary is required" });
    if (!jobType) return res.status(400).json({ message: "Job Type is required" });
    if (!tags || !tags.length) return res.status(400).json({ message: "Tags are required" });
    if (!skills || !skills.length) return res.status(400).json({ message: "Skills are required" });

    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      tags,
      skills,
      salaryType,
      negotiable,
      createdBy: user._id,
    });

    await job.save();
    return res.status(201).json(job);

  } catch (error) {
    console.log("error in createJob", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Add this function (put it after createJob)
export const getJobs = asyncHandler(async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("createdBy", "name profilePicture")
      .sort({ createdAt: -1 }); // newest first
    
    return res.status(200).json(jobs);
  } catch (error) {
    console.log("error in getJobs:", error);
    return res.status(500).json({
      message: "server error",
    });
  }
});


//get jobs by user
export const getJobsByUser = asyncHandler(async (req,res)=>{
    try {
        const user =await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ message: "user not found" });
        }
        const jobs =await Job.findById({createdBy: user._id}).populate(
            "createdBy", 
            "name profilepicture"
        );
        return res.status(200).json(jobs);
  
        
    } catch (error) {
        console.log("error in getJobsByUser:", error);
        return res.status(500).json({
            message: "server error",
        });
        
    }
});
//search jobs 
export const searchJobs = asyncHandler(async (req,res)=>{
    try {
        const {tags,location,title} =req.query;
        let query ={};
        if (tags){
            query.tags={$in : tags.split(",")};

        }
        if (location){
            query.location={$regex : location , $options:"i"};

        }
        if (title){
            query.title={$regex : title , $options:"i"};

        }
        
       
        const jobs =await Job.find(query).populate(
            "createdBy", 
            "name profilepicture"
        );
        return res.status(200).json(jobs);
  
        
    } catch (error) {
        console.log("error in serachJobs:", error);
        return res.status(500).json({
            message: "server error",
        });
        
    }
});
//apply for job 
export const applyJob = asyncHandler(async (req,res)=>{
    try {
       
        const job =await Job.findById(req.params.id);
         if (!job) {
          return res.status(404).json({ message: "job not found" });
        }
        const user =await User.findOne({auth0Id: req.oidc.user.sub});
         if (!user) {
          return res.status(404).json({ message: "user not found" });
        }
        if(job.applicants.includes(user._id)){
            return res.status(400).json({ message: "Already applied for this job" });

        }
        job.applicants.push(user._id);
        await job.save();

        return res.status(200).json(job);
    } catch (error) {
        console.log("error in applyJob:", error);
        return res.status(500).json({
            message: "server error",
        });
        
    }
});
//like and unlike job 
export const likeJob = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
     if (!job) {
          return res.status(404).json({ message: "job not found" });
        }
    const user =await User.findOne({auth0Id: req.oidc.user.sub});
     if (!user) {
        return res.status(404).json({ message: "user not found" });
        }
    const isLiked=job.likes.includes(user._id);
    if(isLiked){
        job.likes=job.likes.filter((like)=>!like.equals(user._id));
    }else{
        job.likes.push(user._id);
    }
    await job.save();
    
    return res.status(200).json(job);
  } catch (error) {
    console.log("error in likeJob:", error);
    return res.status(500).json({
      message: "server error",
    });
  }
});
//get job by id
export const getJobById = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
    const job = await Job.findById(req.id).populate("createdBy", "name profilePicture");
     if (!job) {
          return res.status(404).json({ message: "job not found" });
        }

    return res.status(200).json(job);
  } catch (error) {
    console.log("error in getJobById:", error);
    return res.status(500).json({
      message: "server error",
    });
  }
});
//delete job
export const deleteJob = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
    const job = await Job.findById(req.id).populate("createdBy", "name profilePicture");
     if (!job) {
          return res.status(404).json({ message: "job not found" });
        }
    const user =await User.findOne({auth0Id: req.oidc.user.sub});
        if (!user) {
          return res.status(404).json({ message: "user not found" });
        }
    await job.deleteOne(
        {_id:id,}
    );
    return res.status(200).json({message:"job deleted successfuly"});
  } catch (error) {
    console.log("error in deleteJob:", error);
    return res.status(500).json({
      message: "server error",
    });
  }
});
