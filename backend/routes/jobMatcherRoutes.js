import express from 'express';
import protect from '../middleware/protect.js';
import Job from '../models/JobModel.js'; 
import { calculateAdvancedJobMatch, getJobRecommendations } from '../utils/jobMatcher.js';

const router = express.Router();

// Get match percentage for a specific job
router.get('/job/:jobId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ 
        message: 'Only job seekers can access match data' 
      });
    }

    const job = await Job.findById(req.params.jobId).populate('createdBy');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const matchData = calculateAdvancedJobMatch(req.user, job);
    
    res.json({
      success: true,
      job: {
        _id: job._id,
        title: job.title
      },
      match: matchData
    });
  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to calculate job match',
      error: error.message 
    });
  }
});

// Get all jobs with match percentages
router.get('/jobs', protect, async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ 
        message: 'Only job seekers can access match data' 
      });
    }

    const { minMatch = 0, limit = 50 } = req.query;
    
    const jobs = await Job.find()
      .populate('createdBy')
      .limit(parseInt(limit) * 2);
    
    const jobsWithMatch = jobs.map(job => {
      const matchData = calculateAdvancedJobMatch(req.user, job);
      return {
        ...job.toObject(),
        matchData
      };
    });
    
    const filteredJobs = jobsWithMatch.filter(
      job => job.matchData.matchPercentage >= parseInt(minMatch)
    );
    
    filteredJobs.sort((a, b) => b.matchData.matchPercentage - a.matchData.matchPercentage);
    
    res.json({
      success: true,
      jobs: filteredJobs.slice(0, parseInt(limit)),
      total: filteredJobs.length
    });
  } catch (error) {
    console.error('Jobs with matches error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get job matches',
      error: error.message 
    });
  }
});

// Get top recommendations
router.get('/recommendations', protect, async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ 
        message: 'Only job seekers can access recommendations' 
      });
    }

    const { limit = 10 } = req.query;
    
    const jobs = await Job.find().populate('createdBy');
    const recommendations = getJobRecommendations(req.user, jobs);
    
    res.json({
      success: true,
      recommendations: recommendations.slice(0, parseInt(limit)),
      total: recommendations.length
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get recommendations',
      error: error.message 
    });
  }
});

export default router;