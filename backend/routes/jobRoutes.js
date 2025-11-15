import express from "express";
import { createJob ,searchJobs,getJobs,getJobsByUser,applyJob,likeJob,getJobById,deleteJob} from "../controllers/jobController.js";
import protect from "../middleware/protect.js";
const router =express.Router();

router.post("/jobs", protect , createJob);
router.get("/jobs" , getJobs);
router.get("/jobs/user/:id" , protect , getJobsByUser);
router.get("/jobs/search" , searchJobs);
router.purge("/jobs/apply/:id" , protect, applyJob);
//like and unlike job
router.put("/jobs/like/:id" , protect, likeJob);
router.get("/jobs/:id" , protect , getJobById);
router.delete("/jobs/:id" , protect , deleteJob);












export default router ;