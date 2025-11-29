"use client";
import { useGlobalContext } from "@/context/globalContext";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X, Plus, Code, Tag as TagIcon } from "lucide-react";

function JobSkills() {
  const { skills, setSkills, tags, setTags } = useGlobalContext();

  const [newSkill, setNewSkill] = React.useState("");
  const [newTag, setNewTag] = React.useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev: string[]) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill: string) => skill !== skillToRemove));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev: string[]) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag: string) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Code size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Required Skills</h3>
            <p className="text-sm text-gray-600">Add technical skills needed for this position</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            type="text"
            id="skills"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            className="flex-1 h-12 px-4 border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
            placeholder="e.g., React, TypeScript, Node.js"
          />
          <Button 
            type="button" 
            onClick={handleAddSkill}
            className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </Button>
        </div>

        {skills.length > 0 && (
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Added Skills ({skills.length})</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, index: number) => (
                <div
                  key={index}
                  className="group px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <span className="font-medium">{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-sm text-gray-500 font-medium">Categories & Tags</span>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <TagIcon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Job Categories</h3>
            <p className="text-sm text-gray-600">Add relevant tags to help candidates find this job</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            type="text"
            id="tags"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 h-12 px-4 border-2 border-gray-200 focus:border-pink-500 rounded-xl"
            placeholder="e.g., Full Stack, Remote, Senior"
          />
          <Button 
            type="button" 
            onClick={handleAddTag}
            className="h-12 px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Added Tags ({tags.length})</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <div
                  key={index}
                  className="group px-4 py-2 bg-white border-2 border-pink-200 text-pink-700 rounded-lg flex items-center gap-2 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200"
                >
                  <span className="font-medium">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="w-5 h-5 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors"
                  >
                    <X size={14} className="text-pink-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobSkills;