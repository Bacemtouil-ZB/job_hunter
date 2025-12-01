"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import JobCard from "@/components/JobItem/JobCard";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import JobMatchBadge from '@/components/JobMatchBadge';
import JobMatchDetails from '@/components/JobMatchDetails'
import axios from 'axios';
import formatMoney from "@/utils/formatMoney";
import { formatDates } from "@/utils/fotmatDates";
import {
  Bookmark,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  DollarSign,
  CheckCircle,
  XCircle,
  Tag,
  Code,
  ArrowRight,
  Building,
  Mail,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Applicant {
  _id: string;
  name: string;
  email: string;
}

function Page() {
  const { jobs, likeJob, applyToJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [matchData, setMatchData] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [isLiked, setIsLiked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [otherJobs, setOtherJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Safely handle jobs context and fetch job
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchJobData = async () => {
      setIsLoading(true);
      try {
        // First try to find job in context
        if (Array.isArray(jobs)) {
          const foundJob = jobs.find((job: Job) => job._id === id);
          if (foundJob) {
            setJob(foundJob);
            setOtherJobs(jobs.filter((job: Job) => job._id !== id).slice(0, 5));
            setIsLoading(false);
            return;
          }
        }

        // If not found in context, fetch directly
        const response = await axios.get(`${API_URL}/api/v1/jobs/${id}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setJob(response.data.job);
          
          // Fetch related jobs
          const allJobsResponse = await axios.get(`${API_URL}/api/v1/jobs`, {
            withCredentials: true
          });
          
          if (allJobsResponse.data.success) {
            const allJobs = allJobsResponse.data.jobs || [];
            setOtherJobs(allJobs
              .filter((j: Job) => j._id !== id)
              .slice(0, 5));
          }
        } else {
          toast.error("Job not found");
        }
      } catch (error) {
        console.error("Failed to fetch job:", error);
        toast.error("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [id, jobs, API_URL]);

  useEffect(() => {
    if (job && userProfile._id) {
      setIsApplied(job.applicants.includes(userProfile._id));
      setIsLiked(job.likes.includes(userProfile._id));
    }
  }, [job, userProfile._id]);

  // Fetch applicants if user is the job creator
  useEffect(() => {
    const fetchApplicants = async () => {
      if (job && userProfile._id === job.createdBy._id && id) {
        setLoadingApplicants(true);
        try {
          const response = await fetch(`${API_URL}/api/v1/applicants/${id}`);
          if (response.ok) {
            const data = await response.json();
            setApplicants(data);
          } else {
            toast.error("Failed to load applicants");
          }
        } catch (error) {
          console.error("Error fetching applicants:", error);
          toast.error("Error loading applicants");
        } finally {
          setLoadingApplicants(false);
        }
      }
    };

    fetchApplicants();
  }, [job, userProfile._id, id, API_URL]);

  // Fetch match data
  useEffect(() => {
    const fetchMatch = async () => {
      if (job && isAuthenticated && userProfile.role === "jobseeker") {
        try {
          const response = await axios.get(
            `${API_URL}/api/job-match/job/${job._id}`,
            { withCredentials: true }
          );
          setMatchData(response.data.match);
        } catch (error) {
          console.error("Failed to fetch match:", error);
        }
      }
    };
    
    if (job) {
      fetchMatch();
    }
  }, [job, isAuthenticated, userProfile.role, API_URL]);

  const handleLike = (id: string) => {
    if (!isAuthenticated) {
      router.push(`${API_URL}/login`);
      return;
    }
    
    setIsLiked((prev) => !prev);
    likeJob(id);
    
    if (!isLiked) {
      toast.success("Job saved to favorites!");
    } else {
      toast.success("Job removed from favorites!");
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push(`${API_URL}/login`);
      return;
    }
    
    if (!isApplied && job) {
      applyToJob(job._id);
      setIsApplied(true);
      toast.success("Successfully applied to job!");
    } else {
      toast.error("You have already applied to this job");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/findwork')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Other Jobs
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const {
    title,
    location,
    description,
    salary,
    createdBy,
    applicants: applicantIds,
    jobType,
    createdAt,
    salaryType,
    negotiable,
    tags = [],
    skills = []
  } = job;

  const { name, profilePicture } = createdBy;
  const isJobCreator = userProfile._id === createdBy._id;

  return (
    <main className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar - Related Jobs */}
          <div className="lg:w-80 flex-shrink-0 space-y-6 order-2 lg:order-1">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-600" />
                Related Jobs
              </h3>
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                {otherJobs.map((job: Job) => (
                  <JobCard job={job} key={job._id} />
                ))}
                {otherJobs.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No related jobs found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6 order-1 lg:order-2">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

              <div className="p-6 md:p-8">
                {/* Company Info & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden ring-4 ring-indigo-100">
                        <Image
                          src={profilePicture || "/user.png"}
                          alt={name || "User"}
                          width={80}
                          height={80}
                          className="rounded-2xl object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-4 border-white flex items-center justify-center">
                        <Building size={12} className="text-white" />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">{name}</h2>
                      <p className="text-sm text-gray-600 font-medium">Hiring Manager</p>
                    </div>
                  </div>

                  <button
                    className={`p-3 rounded-xl transition-all duration-200 self-start ${
                      isLiked
                        ? "bg-indigo-100 text-indigo-600 shadow-md"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                    onClick={() => handleLike(job._id)}
                  >
                    <Bookmark size={24} className={isLiked ? "fill-current" : ""} />
                  </button>
                </div>

                {/* Job Title */}
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <MapPin size={18} className="text-indigo-500" />
                  <span className="font-medium">{location}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Salary Card */}
                  <div className="p-4 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-green-700 mb-4">
                      <DollarSign size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide">Salary</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-xl md:text-2xl text-gray-900 leading-tight">
                        {formatMoney(salary, "GBP")}
                      </p>
                      <span className="text-sm font-medium text-gray-600">
                        /{salaryType === "Yearly" ? "year" : salaryType === "Monthly" ? "month" : salaryType === "Weekly" ? "week" : "hour"}
                      </span>
                    </div>
                  </div>

                  {/* Posted Card */}
                  <div className="p-4 md:p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-purple-700 mb-3">
                      <Calendar size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide">Posted</span>
                    </div>
                    <p className="font-bold text-xl md:text-2xl text-gray-900 leading-tight">{formatDates(createdAt)}</p>
                  </div>

                  {/* Applicants Card */}
                  <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-blue-700 mb-3">
                      <Users size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide">Applicants</span>
                    </div>
                    <p className="font-bold text-xl md:text-2xl text-gray-900 leading-tight">{applicantIds.length}</p>
                  </div>

                  {/* Job Type Card */}
                  <div className="p-4 md:p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-orange-700 mb-3">
                      <Briefcase size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide">Type</span>
                    </div>
                    <p className="font-bold text-xl md:text-2xl text-gray-900 leading-tight">{jobType[0]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Briefcase size={16} className="text-white" />
                </div>
                Job Description
              </h2>
              <div
                className="wysiwyg prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              ></div>
            </div>

            {/* Applicants Section - Only visible to job creator */}
            {isJobCreator && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <UserCheck size={16} className="text-white" />
                  </div>
                  Applicants ({applicantIds.length})
                </h2>

                {loadingApplicants ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="text-center py-8">
                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No applicants yet</p>
                    <p className="text-sm text-gray-400 mt-1">Check back later for applications</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applicants.map((applicant, index) => (
                      <div
                        key={applicant._id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {applicant.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{applicant.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} className="text-indigo-500" />
                              <a
                                href={`mailto:${applicant.email}`}
                                className="hover:text-indigo-600 transition-colors"
                              >
                                {applicant.email}
                              </a>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                          #{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Actions & Info */}
          <div className="w-full lg:w-96 space-y-6 order-3">
            <div className="sticky top-24 space-y-6">
              {/* Apply Button - Only show if not the job creator */}
              {!isJobCreator && (
                <button
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                    isApplied
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                  }`}
                  onClick={handleApply}
                  disabled={isApplied}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle size={20} />
                      Applied Successfully
                    </>
                  ) : (
                    <>
                      Apply Now
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              )}

              {/* Message Recruiter Button */}
              {!isJobCreator && (
                <button
                  className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                  onClick={() => router.push(`/chat?receiver=${createdBy._id}`)}
                >
                  Message Recruiter
                </button>
              )}

              {/* Other Information Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Briefcase size={12} className="text-white" />
                  </div>
                  Job Details
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Posted</span>
                    <span className="text-sm font-bold text-gray-900">{formatDates(createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Negotiable</span>
                    <div className="flex items-center gap-1">
                      {negotiable ? (
                        <>
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm font-bold text-green-600">Yes</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-red-500" />
                          <span className="text-sm font-bold text-red-600">No</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Location</span>
                    <span className="text-sm font-bold text-gray-900">{location}</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 font-medium">Job Type</span>
                    <span className="text-sm font-bold text-gray-900">{jobType[0]}</span>
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              {tags.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag size={18} className="text-indigo-600" />
                    Categories
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Job categories and specializations</p>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 text-pink-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Card */}
              {skills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Code size={18} className="text-purple-600" />
                    Required Skills
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Technical skills needed for this role</p>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Match Score Card */}
              {matchData && isAuthenticated && userProfile.role === 'jobseeker' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                    Job Match Score
                  </h3>
                  <JobMatchBadge percentage={matchData.matchPercentage} size="lg" />
                  <div className="mt-4">
                    <JobMatchDetails matchData={matchData} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #a855f7);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #9333ea);
        }
      `}</style>
    </main>
  );
}

export default Page;