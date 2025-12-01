import express from 'express';
import User from '../models/UserModel.js';  
import protect from '../middleware/protect.js';

const router = express.Router();

// Get current user profile
router.get('/', protect, async (req, res) => {
  try {
    // req.user is already attached by protect middleware
    const user = await User.findById(req.user._id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      error: error.message 
    });
  }
});

// Update user profile
router.put('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { 
      role,
      name,
      phone, 
      location, 
      bio, 
      profession,
      skills, 
      experience, 
      education,
      companyName,
      companyDescription,
      companySize,
      industry,
      website
    } = req.body;
    
    // Update role
    if (role !== undefined) user.role = role;
    
    // Common fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    
    // Role-specific updates
    if (user.role === 'jobseeker') {
      if (profession !== undefined) user.profession = profession;
      if (skills !== undefined) user.skills = skills;
      if (experience !== undefined) user.experience = experience;
      if (education !== undefined) user.education = education;
      
      // Clear recruiter fields when switching to jobseeker
      user.companyName = undefined;
      user.companyDescription = undefined;
      user.companySize = undefined;
      user.industry = undefined;
      user.website = undefined;
    } else if (user.role === 'recruiter') {
      if (companyName !== undefined) user.companyName = companyName;
      if (companyDescription !== undefined) user.companyDescription = companyDescription;
      if (companySize !== undefined) user.companySize = companySize;
      if (industry !== undefined) user.industry = industry;
      if (website !== undefined) user.website = website;
      
      // Clear jobseeker fields when switching to recruiter
      user.profession = undefined;
      user.skills = [];
      user.experience = [];
      user.education = [];
    }
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: error.message 
    });
  }
});

export default router;