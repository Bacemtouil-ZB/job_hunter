"use client";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { Calendar, Bookmark, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { formatDates } from "@/utils/fotmatDates";
import JobMatchBadge from '../JobMatchBadge';
import axios from 'axios';

interface JobProps {
  job: Job;
  activeJob?: boolean;
}

function JobCard({ job, activeJob }: JobProps) {
  const { likeJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();

  const [isLiked, setIsLiked] = React.useState(false);

  // ---------------------------
  // 🔥 MATCH DATA ADDED HERE
  // ---------------------------
  const [matchData, setMatchData] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchMatch = async () => {
      if (isAuthenticated && userProfile.role === "jobseeker") {
        try {
          const response = await axios.get(
            `${API_URL}/job-match/job/${job._id}`,
            { withCredentials: true }
          );
          setMatchData(response.data.match);
        } catch (error) {
          console.error("Failed to fetch match:", error);
        }
      }
    };
    fetchMatch();
  }, [job._id, isAuthenticated, userProfile.role]);

  // ---------------------------

  const {
    title,
    salaryType,
    salary,
    createdBy,
    applicants,
    jobType,
    createdAt,
  } = job;

  const { name, profilePicture } = createdBy;

  const router = useRouter();

  const handleLike = (id: string) => {
    setIsLiked((prev) => !prev);
    likeJob(id);
  };

  useEffect(() => {
    setIsLiked(job.likes.includes(userProfile._id));
  }, [job.likes, userProfile._id]);

  const companyDescription =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget nunc.";

  const jobTypeBg = (type: string) => {
    switch (type) {
      case "Full Time":
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-700";
      case "Part Time":
        return "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-300 text-purple-700";
      case "Contract":
        return "bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-700";
      case "Internship":
        return "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-300 text-indigo-700";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 text-gray-700";
    }
  };

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-300 overflow-hidden ${
        activeJob
          ? "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-lg ring-2 ring-indigo-400"
          : "bg-white hover:shadow-xl border border-gray-100 hover:border-indigo-200"
      }`}
    >
      <div className={`h-1 ${
        activeJob
          ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          : "bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500"
      }`}></div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div
            className="flex gap-3 items-start cursor-pointer flex-1"
            onClick={() => router.push(`/job/${job._id}`)}
          >
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center ring-2 ring-gray-100 overflow-hidden">
                <Image
                  src={profilePicture || "/user.png"}
                  alt={name || "User"}
                  width={56}
                  height={56}
                  className="rounded-xl object-cover"
                />
              </div>

              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h4 className="font-bold text-lg text-gray-900 line-clamp-1">
                {title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{name}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Users size={14} />
                  <span>
                    {applicants.length}{" "}
                    {applicants.length === 1 ? "applicant" : "applicants"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bookmark */}
          <button
            className={`p-2.5 rounded-xl ${
              isLiked
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}
            onClick={() =>
              isAuthenticated
                ? handleLike(job._id)
                : router.push("http://localhost:8000/login")
            }
          >
            <Bookmark size={18} className={isLiked ? "fill-current" : ""} />
          </button>
        </div>

        {/* Job Type Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {jobType.map((type, index) => (
            <span
              key={index}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg border ${jobTypeBg(
                type
              )}`}
            >
              {type}
            </span>
          ))}
        </div>

        {/* ------------------------------ */}
        {/* 🔥 MATCH BADGE ADDED HERE       */}
        {/* ------------------------------ */}
        {matchData && (
          <div className="mb-4">
            <JobMatchBadge percentage={matchData.matchPercentage} size="sm" />
          </div>
        )}

        <Separator className="my-4" />

        {/* Footer */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">
              £{salary.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-gray-500">
              /
              {salaryType === "Yearly"
                ? "year"
                : salaryType === "Monthly"
                ? "month"
                : salaryType === "Weekly"
                ? "week"
                : "hour"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar size={14} className="text-indigo-500" />
            <span>{formatDates(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
