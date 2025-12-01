"use client";
import Filters from "@/components/filters";
import Footer from "@/components/footer";
import Header from "@/components/header";
import JobCard from "@/components/JobItem/JobCard";
import SearchForm from "@/components/SearchForm";
import { useJobsContext } from "@/context/jobsContext";
import { useGlobalContext } from "@/context/globalContext";
import { Job } from "@/types/types";
import { grip, list, table } from "@/utils/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface JobWithMatch extends Job {
  matchPercentage?: number;
  matchBreakdown?: any;
}

function Page() {
  const { jobs = [], filters = {} } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const [columns, setColumns] = React.useState(3);
  const [jobsWithMatches, setJobsWithMatches] = useState<JobWithMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortByMatch, setSortByMatch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CORRECTED: API_URL should NOT include /api at the end
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchMatches = async () => {
      if (!isAuthenticated || userProfile.role !== "jobseeker" || jobs.length === 0) {
        setJobsWithMatches(jobs);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const batchSize = 10;
        const jobsWithMatchData: JobWithMatch[] = [];

        for (let i = 0; i < jobs.length; i += batchSize) {
          const batch = jobs.slice(i, i + batchSize);
          
          const batchResults = await Promise.all(
            batch.map(async (job: Job) => {
              try {
                // CORRECTED: Add /api/ to the path
                const response = await axios.get(
                  `${API_URL}/api/job-match/job/${job._id}`,
                  { withCredentials: true }
                );
                
                return {
                  ...job,
                  matchPercentage: response.data.match?.matchPercentage || 0,
                  matchBreakdown: response.data.match?.breakdown || {}
                };
              } catch (error) {
                return { 
                  ...job, 
                  matchPercentage: 0,
                  matchBreakdown: {}
                };
              }
            })
          );

          jobsWithMatchData.push(...batchResults);
          setJobsWithMatches([...jobsWithMatchData]);
        }
      } catch (error) {
        setError("Failed to load job matches.");
        setJobsWithMatches(jobs);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [jobs, isAuthenticated, userProfile?.role, API_URL]);

  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  const getIcon = () => {
    if (columns === 3) return grip;
    if (columns === 2) return table;
    return list;
  };

  const filteredJobs =
    filters.fullTime ||
    filters.partTime ||
    filters.contract ||
    filters.internship
      ? jobsWithMatches.filter((job: JobWithMatch) => {
          if (filters.fullTime && job.jobType.includes("Full Time")) return true;
          if (filters.partTime && job.jobType.includes("Part Time")) return true;
          if (filters.contract && job.jobType.includes("Contract")) return true;
          if (filters.internship && job.jobType.includes("Internship")) return true;
          if (filters.fullStack && job.tags?.includes("Full Stack")) return true;
          if (filters.backend && job.tags?.includes("Backend")) return true;
          if (filters.devOps && job.tags?.includes("DevOps")) return true;
          if (filters.uiUx && job.tags?.includes("UI/UX")) return true;
          return false;
        })
      : jobsWithMatches;

  const displayJobs = sortByMatch
    ? [...filteredJobs].sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    : filteredJobs;

  const shouldShowMatches = isAuthenticated && userProfile?.role === "jobseeker";

  return (
    <main>
      <Header />
      <div className="relative px-16 bg-[#D7DEDC] overflow-hidden">
        <h1 className="py-8 text-black font-bold text-3xl">
          Find Your Next Job Here
        </h1>
        <div className="pb-8 relative z-10">
          <SearchForm />
        </div>
      </div>

      <div className="w-[90%] mx-auto mb-14">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-black py-8">Recent Jobs</h2>
            {loading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                <span className="text-sm text-gray-500">Calculating matches...</span>
              </div>
            )}
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>

          <div className="flex items-center gap-4">
            {shouldShowMatches && (
              <button
                onClick={() => setSortByMatch(!sortByMatch)}
                disabled={loading}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  sortByMatch
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "border border-gray-400 text-gray-700 hover:border-indigo-400"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {sortByMatch ? "✓ Sorted by Match" : "Sort by Match"}
              </button>
            )}

            <button
              onClick={toggleGridColumns}
              className="flex items-center gap-4 border border-gray-400 px-8 py-2 rounded-full font-medium"
            >
              <span>
                {columns === 3 ? "Grid View" : columns === 2 ? "Table View" : "List View"}
              </span>
              <span className="text-lg">{getIcon()}</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          <Filters />
          <div
            className={`self-start flex-1 grid gap-8 ${
              columns === 3 ? "grid-cols-3" : columns === 2 ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {displayJobs.length > 0 ? (
              displayJobs.map((job: JobWithMatch) => (
                <JobCard 
                  key={job._id} 
                  job={job}
                  matchPercentage={job.matchPercentage}
                />
              ))
            ) : (
              <div className="mt-1 flex flex-col items-center py-12">
                <p className="text-2xl font-bold text-gray-800">No Jobs Found!</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Page;