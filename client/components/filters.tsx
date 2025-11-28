"use client";
import React from "react";
import { Button } from "./ui/button";
import { useJobsContext } from "@/context/jobsContext";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import formatMoney from "@/utils/formatMoney";

function Filters() {
  const {
    handleFilterChange,
    filters,
    setFilters,
    minSalary,
    maxSalary,
    setMinSalary,
    setMaxSalary,
    searchJobs,
    setSearchQuery,
  } = useJobsContext();

  const clearAllFilters = () => {
    setFilters({
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false,
      fullStack: false,
      backend: false,
      devOps: false,
      uiUx: false,
    });

    setSearchQuery({ tags: "", location: "", title: "" });
  };

  const handleMinSalaryChange = (value: number[]) => {
    setMinSalary(value[0]);
    if (value[0] > maxSalary) {
      setMaxSalary(value[0]);
    }
  };

  const handleMaxSalaryChange = (value: number[]) => {
    setMaxSalary(value[0]);
    if (value[0] < minSalary) {
      setMinSalary(value[0]);
    }
  };

  const jobTypes = [
    { id: "fullTime", label: "Full Time", icon: "💼" },
    { id: "partTime", label: "Part Time", icon: "⏰" },
    { id: "contract", label: "Contract", icon: "📝" },
    { id: "internship", label: "Internship", icon: "🎓" },
  ];

  const tags = [
    { id: "fullStack", label: "Full Stack", icon: "⚡", color: "from-purple-500 to-pink-500" },
    { id: "backend", label: "Backend", icon: "🔧", color: "from-blue-500 to-cyan-500" },
    { id: "devOps", label: "DevOps", icon: "🚀", color: "from-green-500 to-emerald-500" },
    { id: "uiUx", label: "UI/UX", icon: "🎨", color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="w-full lg:w-[24rem] space-y-6">
      {/* Glass morphism card */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 space-y-8">
        
        {/* Header with clear button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Filters
            </h2>
          </div>

          <Button
            variant="ghost"
            className="h-auto px-3 py-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-all duration-200"
            onClick={() => {
              clearAllFilters();
              searchJobs();
            }}
          >
            Clear All
          </Button>
        </div>

        {/* Job Type Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Job Type
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {jobTypes.map((type) => (
              <label
                key={type.id}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer
                  transition-all duration-300 border-2 group
                  ${
                    filters[type.id as keyof typeof filters]
                      ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-400 shadow-md"
                      : "bg-gray-50 border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                  }
                `}
              >
                <Checkbox
                  id={type.id}
                  checked={filters[type.id as keyof typeof filters]}
                  onCheckedChange={() => handleFilterChange(type.id)}
                  className="sr-only"
                />
                <span className="text-3xl mb-2 transform transition-transform group-hover:scale-110">
                  {type.icon}
                </span>
                <span className={`text-xs font-semibold text-center ${
                  filters[type.id as keyof typeof filters] ? "text-indigo-700" : "text-gray-700"
                }`}>
                  {type.label}
                </span>
                {filters[type.id as keyof typeof filters] && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Skills & Tags
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <div className="space-y-3">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className={`
                  relative flex items-center p-4 rounded-xl cursor-pointer
                  transition-all duration-300 border-2 group overflow-hidden
                  ${
                    filters[tag.id as keyof typeof filters]
                      ? `bg-gradient-to-r ${tag.color} border-transparent shadow-lg`
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }
                `}
              >
                <Checkbox
                  id={tag.id}
                  checked={filters[tag.id as keyof typeof filters]}
                  onCheckedChange={() => handleFilterChange(tag.id)}
                  className="sr-only"
                />
                
                <div className="flex items-center gap-3 flex-1 relative z-10">
                  <span className={`text-2xl transform transition-transform group-hover:scale-110 ${
                    filters[tag.id as keyof typeof filters] ? "filter drop-shadow-lg" : ""
                  }`}>
                    {tag.icon}
                  </span>
                  <span className={`font-semibold ${
                    filters[tag.id as keyof typeof filters] ? "text-white" : "text-gray-700"
                  }`}>
                    {tag.label}
                  </span>
                </div>

                {filters[tag.id as keyof typeof filters] && (
                  <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range Section */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              💰 Salary Range
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Min Salary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="minSalary" className="text-sm font-medium text-gray-700">
                Minimum
              </Label>
              <div className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                <span className="text-sm font-bold text-green-700">
                  {formatMoney(minSalary, "GBP")}
                </span>
              </div>
            </div>
            <div className="relative pt-2 pb-1">
              <Slider
                id="minSalary"
                min={0}
                max={200000}
                step={50}
                value={[minSalary]}
                onValueChange={handleMinSalaryChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Max Salary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxSalary" className="text-sm font-medium text-gray-700">
                Maximum
              </Label>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
                <span className="text-sm font-bold text-blue-700">
                  {formatMoney(maxSalary, "GBP")}
                </span>
              </div>
            </div>
            <div className="relative pt-2 pb-1">
              <Slider
                id="maxSalary"
                min={0}
                max={200000}
                step={50}
                value={[maxSalary]}
                onValueChange={handleMaxSalaryChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Range summary */}
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Your Range:</span>
              <span className="font-bold text-indigo-700">
                {formatMoney(minSalary, "GBP")} - {formatMoney(maxSalary, "GBP")}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Filters;