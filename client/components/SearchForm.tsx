"use client";
import { useJobsContext } from "@/context/jobsContext";
import { location } from "@/utils/icons";
import { Search } from "lucide-react";
import React from "react";

function SearchForm() {
  const { searchJobs, handleSearchChange, searchQuery } = useJobsContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobs(searchQuery.tags, searchQuery.location, searchQuery.title);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-lg">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Job Title Input */}
          <div className="flex-1 relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
              <Search
                size={24}
                className="text-indigo-400 group-focus-within:text-indigo-600 transition-colors duration-200"
              />
            </div>
            <input
              type="text"
              id="job-title"
              name="title"
              value={searchQuery.title}
              onChange={(e) => handleSearchChange("title", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="Job title or keyword"
              className="w-full py-5 px-16 text-gray-800 placeholder:text-gray-400 text-base font-medium focus:outline-none focus:ring-0 bg-transparent"
            />
            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>

          {/* Vertical Divider - Hidden on mobile */}
          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent self-stretch my-3"></div>

          {/* Location Input */}
          <div className="flex-1 relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
              <span className="text-indigo-400 text-2xl group-focus-within:text-indigo-600 transition-colors duration-200">
                {location}
              </span>
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={searchQuery.location}
              onChange={(e) => handleSearchChange("location", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="City or remote"
              className="w-full py-5 px-16 text-gray-800 placeholder:text-gray-400 text-base font-medium focus:outline-none focus:ring-0 bg-transparent"
            />
            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>

          {/* Search Button */}
          <div className="p-2 md:p-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-10 py-3 md:py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Search size={20} />
              <span>Search Jobs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick filters / suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-600">Popular:</span>
        {["Remote", "Full-time", "Senior", "JavaScript"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleSearchChange("title", tag)}
            className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-indigo-300 rounded-full text-sm font-medium text-gray-700 hover:text-indigo-600 transition-all duration-200 hover:shadow-md"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchForm;