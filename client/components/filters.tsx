"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useJobsContext } from "@/context/jobsContext";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Briefcase, Clock, FileText, GraduationCap, Code, Server, Rocket, Palette, Coins, Filter, X, Sparkles } from "lucide-react";

const formatTND = (amount: number) => {
  return `${amount.toLocaleString('en-US')} TND`;
};

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

  // Trigger search when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      searchJobs();
    }, 300);
    return () => clearTimeout(timer);
  }, [minSalary, maxSalary, filters, searchJobs]);

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
    setMinSalary(0);
    setMaxSalary(50000);
    setSearchQuery({ tags: "", location: "", title: "" });
  };

  const handleMinSalaryChange = (value: number[]) => {
    const newMin = value[0];
    setMinSalary(newMin);
    if (newMin > maxSalary) setMaxSalary(newMin);
  };

  const handleMaxSalaryChange = (value: number[]) => {
    const newMax = value[0];
    setMaxSalary(newMax);
    if (newMax < minSalary) setMinSalary(newMax);
  };

  const jobTypes = [
    { id: "fullTime", label: "Full Time", Icon: Briefcase, gradient: "from-blue-500 to-blue-600" },
    { id: "partTime", label: "Part Time", Icon: Clock, gradient: "from-purple-500 to-purple-600" },
    { id: "contract", label: "Contract", Icon: FileText, gradient: "from-orange-500 to-orange-600" },
    { id: "internship", label: "Internship", Icon: GraduationCap, gradient: "from-green-500 to-green-600" },
  ];

  const skills = [
    { id: "fullStack", label: "Full Stack", Icon: Code, color: "violet" },
    { id: "backend", label: "Backend", Icon: Server, color: "blue" },
    { id: "devOps", label: "DevOps", Icon: Rocket, color: "emerald" },
    { id: "uiUx", label: "UI/UX", Icon: Palette, color: "rose" },
  ];

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  const isSalaryFiltered = minSalary > 0 || maxSalary < 50000;

  return (
    <div className="w-full lg:w-96">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="px-2.5 py-0.5 bg-white/30 backdrop-blur-sm rounded-full text-sm font-semibold">
                      {activeFiltersCount}
                    </span>
                  )}
                </h2>
                <p className="text-white/80 text-xs mt-0.5">Refine your search</p>
              </div>
            </div>
            {(activeFiltersCount > 0 || isSalaryFiltered) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-white hover:bg-white/20 backdrop-blur-sm rounded-xl"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Type */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Job Type</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {jobTypes.map(({ id, label, Icon, gradient }) => {
                const isActive = filters[id as keyof typeof filters];
                return (
                  <button
                    key={id}
                    onClick={() => handleFilterChange(id)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-br ${gradient} border-transparent text-white shadow-lg scale-105`
                        : "bg-gray-50 border-gray-200 hover:border-indigo-300 hover:shadow-md text-gray-700"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-bold">{label}</span>
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills - New Chip Design */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Skills & Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(({ id, label, Icon, color }) => {
                const isActive = filters[id as keyof typeof filters];
                return (
                  <button
                    key={id}
                    onClick={() => handleFilterChange(id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 font-semibold text-sm transition-all duration-300 ${
                      isActive
                        ? `bg-${color}-500 border-${color}-600 text-white shadow-lg scale-105`
                        : `bg-white border-${color}-200 text-${color}-700 hover:border-${color}-400 hover:shadow-md`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {isActive && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Salary Range - New Card Design */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 border-2 border-amber-200 shadow-inner">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Salary Range</h3>
            </div>

            <div className="space-y-5">
              {/* Min Salary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold text-gray-700 uppercase">Minimum</Label>
                  <div className="px-4 py-1.5 bg-white rounded-full shadow-md border-2 border-green-300">
                    <span className="text-sm font-bold text-green-700">
                      {formatTND(minSalary)}
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <Slider
                    min={0}
                    max={50000}
                    step={500}
                    value={[minSalary]}
                    onValueChange={handleMinSalaryChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Max Salary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold text-gray-700 uppercase">Maximum</Label>
                  <div className="px-4 py-1.5 bg-white rounded-full shadow-md border-2 border-blue-300">
                    <span className="text-sm font-bold text-blue-700">
                      {formatTND(maxSalary)}
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <Slider
                    min={0}
                    max={50000}
                    step={500}
                    value={[maxSalary]}
                    onValueChange={handleMaxSalaryChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Range Display */}
              <div className="bg-white rounded-xl p-4 shadow-md border-2 border-amber-300">
                <div className="text-center">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Selected Range</p>
                  <p className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {formatTND(minSalary)} - {formatTND(maxSalary)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Filters;