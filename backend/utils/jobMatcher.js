import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

/**
 * Calculate job match percentage based on skills and job requirements
 */
export const calculateJobMatch = (userProfile, job) => {
  const tfidf = new TfIdf();
  
  // Prepare user profile text
  const userSkills = (userProfile.skills || []).join(' ');
  const userBio = userProfile.bio || '';
  const userProfession = userProfile.profession || '';
  const userExperience = (userProfile.experience || [])
    .map(exp => `${exp.position} ${exp.description || ''}`)
    .join(' ');
  
  const userText = `${userSkills} ${userBio} ${userProfession} ${userExperience}`.toLowerCase();
  
  // Prepare job text
  const jobSkills = (job.skills || []).join(' ');
  const jobTitle = job.title || '';
  const jobDescription = job.description || '';
  const jobTags = (job.tags || []).join(' ');
  
  const jobText = `${jobSkills} ${jobTitle} ${jobDescription} ${jobTags}`.toLowerCase();
  
  // Add documents to TF-IDF
  tfidf.addDocument(userText);
  tfidf.addDocument(jobText);
  
  // Calculate similarity
  const userTerms = tokenizer.tokenize(userText);
  const jobTerms = tokenizer.tokenize(jobText);
  
  // Find common terms
  const commonTerms = userTerms.filter(term => jobTerms.includes(term));
  
  // Calculate match percentage
  let matchScore = 0;
  
  // Skill matching (weighted heavily - 60%)
  const userSkillsArray = (userProfile.skills || []).map(s => s.toLowerCase());
  const jobSkillsArray = (job.skills || []).map(s => s.toLowerCase());
  const matchingSkills = userSkillsArray.filter(skill => 
    jobSkillsArray.some(jobSkill => 
      jobSkill.includes(skill) || skill.includes(jobSkill)
    )
  );
  
  const skillMatchRatio = jobSkillsArray.length > 0 
    ? matchingSkills.length / jobSkillsArray.length 
    : 0;
  matchScore += skillMatchRatio * 60;
  
  // Text similarity (30%)
  const textSimilarity = commonTerms.length / Math.max(userTerms.length, jobTerms.length);
  matchScore += textSimilarity * 30;
  
  // Job type preference matching (10%)
  // If user has Full Time experience and job is Full Time, add bonus
  if (userProfile.experience && userProfile.experience.length > 0 && job.jobType) {
    matchScore += 10;
  }
  
  // Cap at 100%
  matchScore = Math.min(100, Math.round(matchScore));
  
  return {
    matchPercentage: matchScore,
    matchingSkills: matchingSkills,
    missingSkills: jobSkillsArray.filter(skill => 
      !userSkillsArray.some(userSkill => 
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    ),
    totalRequiredSkills: jobSkillsArray.length,
    matchedTags: (job.tags || []).filter(tag => 
      userText.includes(tag.toLowerCase())
    )
  };
};

/**
 * Calculate total years of experience
 */
const calculateYearsOfExperience = (experiences) => {
  let totalMonths = 0;
  
  experiences.forEach(exp => {
    if (exp.startDate) {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += Math.max(0, months);
    }
  });
  
  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal
};

/**
 * Advanced matching with experience level consideration
 */
export const calculateAdvancedJobMatch = (userProfile, job) => {
  const basicMatch = calculateJobMatch(userProfile, job);
  
  // Experience calculation
  const userYearsOfExperience = calculateYearsOfExperience(userProfile.experience || []);
  
  // Location matching bonus
  let locationBonus = 0;
  if (userProfile.location && job.location) {
    const userLoc = userProfile.location.toLowerCase();
    const jobLoc = job.location.toLowerCase();
    if (userLoc.includes(jobLoc) || jobLoc.includes(userLoc)) {
      locationBonus = 5;
    }
  }
  
  // Adjust final score with location bonus
  const finalScore = Math.min(100, Math.round(basicMatch.matchPercentage + locationBonus));
  
  return {
    ...basicMatch,
    matchPercentage: finalScore,
    userYearsOfExperience,
    locationMatch: locationBonus > 0
  };
};

/**
 * Get personalized job recommendations
 */
export const getJobRecommendations = (userProfile, jobs) => {
  const jobsWithMatch = jobs.map(job => {
    const matchData = calculateAdvancedJobMatch(userProfile, job);
    return {
      job,
      matchData
    };
  });
  
  // Sort by match percentage
  return jobsWithMatch.sort((a, b) => 
    b.matchData.matchPercentage - a.matchData.matchPercentage
  );
};