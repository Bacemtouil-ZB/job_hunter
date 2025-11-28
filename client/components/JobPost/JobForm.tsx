"use client";
import { useGlobalContext } from "@/context/globalContext";
import React from "react";
import JobTitle from "./JobTitle";
import JobDetails from "./JobDetails";
import JobSkills from "./JobSkills";
import JobLocation from "./JobLocation";
import { useJobsContext } from "@/context/jobsContext";
import { 
  FileText, 
  Briefcase, 
  Code, 
  MapPin, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

function JobForm() {
  const {
    jobTitle,
    jobDescription,
    salaryType,
    activeEmploymentTypes,
    salary,
    location,
    skills,
    negotiable,
    tags,
    resetJobForm,
  } = useGlobalContext();
  const { createJob } = useJobsContext();

  const sections = [
    { id: "About", label: "About", icon: FileText },
    { id: "Job Details", label: "Job Details", icon: Briefcase },
    { id: "Skills", label: "Skills", icon: Code },
    { id: "Location", label: "Location", icon: MapPin },
  ];
  
  const [currentSection, setCurrentSection] = React.useState(sections[0].id);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const renderStages = () => {
    switch (currentSection) {
      case "About":
        return <JobTitle />;
      case "Job Details":
        return <JobDetails />;
      case "Skills":
        return <JobSkills />;
      case "Location":
        return <JobLocation />;
    }
  };

  const isCompleted = (section: string) => {
    switch (section) {
      case "About":
        return jobTitle && activeEmploymentTypes.length > 0;
      case "Job Details":
        return jobDescription && salary > 0;
      case "Skills":
        return skills.length > 0 && tags.length > 0;
      case "Location":
        return location.address || location.city || location.country;
      default:
        return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJob({
      title: jobTitle,
      description: jobDescription,
      salaryType,
      jobType: activeEmploymentTypes,
      salary,
      location: `${location.address ? location.address + ", " : ""}${
        location.city ? location.city + ", " : ""
      }${location.country}`,
      skills,
      negotiable,
      tags,
    });

    resetJobForm();
  };

  const getCurrentIndex = () => sections.findIndex(s => s.id === currentSection);
  const isLastSection = getCurrentIndex() === sections.length - 1;

  return (
    <div className="w-full flex gap-8">
      {/* Progress Sidebar */}
      <div className="w-72 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Create Job Post</h3>
            </div>
            <p className="text-sm text-gray-600">Complete all sections to publish</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Progress</span>
              <span className="text-xs font-bold text-indigo-600">
                {sections.filter(s => isCompleted(s.id)).length}/{sections.length}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
                style={{ 
                  width: `${(sections.filter(s => isCompleted(s.id)).length / sections.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const completed = isCompleted(section.id);
              const active = currentSection === section.id;
              
              return (
                <button
                  key={index}
                  className={`w-full text-left relative transition-all duration-200 group ${
                    active ? "scale-[1.02]" : ""
                  }`}
                  onClick={() => handleSectionChange(section.id)}
                >
                  <div className={`
                    flex items-center gap-3 p-4 rounded-xl transition-all duration-200
                    ${active 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg" 
                      : completed
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }
                  `}>
                    {/* Icon/Number */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${active 
                        ? "bg-white/20" 
                        : completed
                        ? "bg-green-100"
                        : "bg-white"
                      }
                    `}>
                      {completed ? (
                        <CheckCircle size={20} className={active ? "text-white" : "text-green-600"} />
                      ) : (
                        <span className={`font-bold ${active ? "text-white" : "text-gray-400"}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${active ? "text-white" : ""}`}>
                        {section.label}
                      </p>
                      <p className={`text-xs ${
                        active 
                          ? "text-white/80" 
                          : completed
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}>
                        {completed ? "Completed" : "Not completed"}
                      </p>
                    </div>

                    {/* Icon */}
                    <Icon size={18} className={active ? "text-white" : "text-gray-400"} />
                  </div>

                  {/* Active indicator */}
                  {active && (
                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full"></div>
                  )}

                  {/* Connector line */}
                  {index < sections.length - 1 && (
                    <div className={`
                      absolute left-9 top-full w-0.5 h-2 transition-colors duration-200
                      ${completed ? "bg-green-300" : "bg-gray-200"}
                    `}></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8">
            {/* Section Title */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                {sections.find(s => s.id === currentSection) && (
                  <>
                    {React.createElement(sections.find(s => s.id === currentSection)!.icon, {
                      size: 24,
                      className: "text-indigo-600"
                    })}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentSection}
                    </h2>
                  </>
                )}
              </div>
              <p className="text-gray-600">
                {currentSection === "About" && "Tell us about the job position"}
                {currentSection === "Job Details" && "Provide detailed information about the role"}
                {currentSection === "Skills" && "List required skills and categories"}
                {currentSection === "Location" && "Where is this job located?"}
              </p>
            </div>

            {/* Form Content */}
            <div className="mb-8">
              {renderStages()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  getCurrentIndex() > 0
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (getCurrentIndex() > 0) {
                    setCurrentSection(sections[getCurrentIndex() - 1].id);
                  }
                }}
                disabled={getCurrentIndex() === 0}
              >
                Previous
              </button>

              <div className="flex gap-3">
                {!isLastSection ? (
                  <button
                    type="button"
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    onClick={() => {
                      setCurrentSection(sections[getCurrentIndex() + 1].id);
                    }}
                  >
                    Next
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Post Job
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobForm;