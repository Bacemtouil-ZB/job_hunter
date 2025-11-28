"use client";
import React, { useEffect } from "react";
import { Job } from "@/types/types";
import { useJobsContext } from "@/context/jobsContext";
import Image from "next/image";
import { formatDates } from "@/utils/fotmatDates";
import { Pencil, Trash, MapPin, Clock, Bookmark, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { bookmark, bookmarkEmpty } from "@/utils/icons";

interface JobProps {
  job: Job;
}

function MyJob({ job }: JobProps) {
  const { deleteJob, likeJob } = useJobsContext();
  const { userProfile, isAuthenticated, getUserProfile } = useGlobalContext();
  const [isLiked, setIsLiked] = React.useState(false);

  const router = useRouter();

  const handleLike = (id: string) => {
    setIsLiked((prev) => !prev);
    likeJob(id);
  };

  useEffect(() => {
    if (isAuthenticated && job.createdBy._id) {
      getUserProfile(job.createdBy._id);
    }
  }, [isAuthenticated, job.createdBy._id]);

  useEffect(() => {
    if (userProfile?._id) {
      setIsLiked(job.likes.includes(userProfile?._id));
    }
  }, [job.likes, userProfile._id]);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-2xl overflow-hidden">
      {/* Gradient accent bars - dual color stripes like pushpins */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="p-6">
        {/* "Your Listing" Badge */}
        <div className="absolute top-6 right-6 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg">
            <Sparkles size={14} className="text-white" />
            <span className="text-xs font-bold text-white">Your Listing</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-5">
          <div
            className="flex items-center space-x-4 cursor-pointer flex-1 pr-28"
            onClick={() => router.push(`/job/${job._id}`)}
          >
            <div className="relative flex-shrink-0">
              <Image
                alt={`${job.createdBy.name} logo`}
                src={job.createdBy.profilePicture || "/user.png"}
                width={64}
                height={64}
                className="rounded-xl shadow-md ring-4 ring-indigo-50 group-hover:ring-indigo-100 transition-all duration-300 object-cover"
              />
              {/* Premium indicator */}
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                <Sparkles size={12} className="text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-1 line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {job.createdBy.name}
              </p>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            className={`absolute top-16 right-6 flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 shadow-sm ${
              isLiked
                ? "bg-indigo-100 text-indigo-600 shadow-md"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}
            onClick={() => {
              isAuthenticated
                ? handleLike(job._id)
                : router.push("http://localhost:8000/login");
            }}
          >
            <Bookmark
              size={18}
              className={isLiked ? "fill-current" : ""}
            />
          </button>
        </div>

        {/* Location and Date */}
        <div className="flex items-center gap-4 mb-5 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
            <MapPin size={16} className="text-indigo-600" />
            <span className="text-indigo-700 font-medium">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
            <Clock size={16} className="text-purple-600" />
            <span className="text-purple-700 font-medium">Posted {formatDates(job.createdAt)}</span>
          </div>
        </div>

        {/* Skills and Tags Section */}
        <div className="space-y-3 mb-5">
          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills Required</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</p>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white border-2 border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {job.createdBy._id === userProfile?._id && (
          <div className="flex gap-3 pt-5 border-t-2 border-gray-100">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-md"
              onClick={() => router.push(`/job/edit/${job._id}`)}
            >
              <Pencil size={16} />
              <span>Edit Listing</span>
            </button>

            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-md"
              onClick={() => deleteJob(job._id)}
            >
              <Trash size={16} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Hover effect gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}

export default MyJob;