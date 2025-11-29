"use client";
import { useGlobalContext } from "@/context/globalContext";
import React from "react";
import { Label } from "../ui/label";
import "react-quill-new/dist/quill.snow.css";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import dynamic from "next/dynamic";
import { DollarSign, FileText } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

function MyEditor() {
  const { setJobDescription, jobDescription } = useGlobalContext();
  return (
    <ReactQuill
      value={jobDescription}
      onChange={setJobDescription}
      style={{
        minHeight: "400px",
        maxHeight: "900px",
      }}
      modules={{
        toolbar: true,
      }}
      className="custom-quill-editor border-2 border-gray-200 rounded-xl"
    />
  );
}

function JobDetails() {
  const {
    handleSalaryChange,
    salary,
    salaryType,
    setSalaryType,
    setNegotiable,
    negotiable,
  } = useGlobalContext();

  return (
    <div className="space-y-8">
      {/* Job Description Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Job Description</h3>
            <p className="text-sm text-gray-600">Provide detailed information about the role</p>
          </div>
        </div>

        <div className="mt-4">
          <MyEditor />
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-sm text-gray-500 font-medium">Compensation</span>
        </div>
      </div>

      {/* Salary Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <DollarSign size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Salary Details</h3>
            <p className="text-sm text-gray-600">Set the compensation for this position</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Salary Input */}
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-semibold text-gray-700">
              Salary Amount
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">£</span>
              <Input
                type="number"
                id="salary"
                placeholder="50,000"
                value={salary}
                onChange={handleSalaryChange}
                className="h-12 pl-8 pr-4 border-2 border-gray-200 focus:border-green-500 rounded-xl"
              />
            </div>
          </div>

          {/* Salary Type */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Payment Period
            </Label>
            <Select onValueChange={setSalaryType} value={salaryType}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yearly">Per Year</SelectItem>
                <SelectItem value="Monthly">Per Month</SelectItem>
                <SelectItem value="Weekly">Per Week</SelectItem>
                <SelectItem value="Hourly">Per Hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-3 mt-4">
          <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl cursor-pointer transition-colors">
            <Checkbox id="negotiable" checked={negotiable} onCheckedChange={setNegotiable} />
            <span className="text-sm font-medium text-gray-700">Salary is negotiable</span>
          </label>
          
          <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl cursor-pointer transition-colors">
            <Checkbox id="hideSalary" />
            <span className="text-sm font-medium text-gray-700">Hide salary from listing</span>
          </label>
        </div>

        {/* Salary Preview */}
        {salary > 0 && salaryType && (
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Salary Preview</p>
            <p className="text-2xl font-bold text-gray-900">
              £{salary.toLocaleString()}
              <span className="text-base font-medium text-gray-600">
                {" /"}{salaryType === "Yearly" ? "year" : salaryType === "Monthly" ? "month" : salaryType === "Weekly" ? "week" : "hour"}
              </span>
            </p>
            {negotiable && (
              <p className="text-xs text-green-600 font-medium mt-1">💬 Negotiable</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetails;