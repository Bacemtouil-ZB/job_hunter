import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface MatchData {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  totalRequiredSkills: number;
  matchedTags?: string[];
  locationMatch?: boolean;
  userYearsOfExperience?: number;
}

interface JobMatchDetailsProps {
  matchData: MatchData;
}

export default function JobMatchDetails({ matchData }: JobMatchDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Matching Skills */}
      {matchData.matchingSkills.length > 0 && (
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={18} className="text-green-600" />
            <h4 className="font-bold text-green-900">Your Matching Skills</h4>
            <span className="ml-auto text-sm font-semibold text-green-700">
              {matchData.matchingSkills.length}/{matchData.totalRequiredSkills}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchData.matchingSkills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {matchData.missingSkills.length > 0 && (
        <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-orange-600" />
            <h4 className="font-bold text-orange-900">Skills to Develop</h4>
            <span className="ml-auto text-sm font-semibold text-orange-700">
              {matchData.missingSkills.length} missing
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchData.missingSkills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-white border-2 border-orange-200 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-50 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Match Info */}
      {(matchData.matchedTags && matchData.matchedTags.length > 0) || matchData.locationMatch && (
        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-blue-600" />
            <h4 className="font-bold text-blue-900">Additional Matches</h4>
          </div>
          <div className="space-y-2 text-sm">
            {matchData.locationMatch && (
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-600" />
                <span className="text-blue-700 font-medium">Location matches your profile</span>
              </div>
            )}
            {matchData.matchedTags && matchData.matchedTags.length > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-600" />
                <span className="text-blue-700 font-medium">
                  Matches {matchData.matchedTags.length} of your interests
                </span>
              </div>
            )}
            {matchData.userYearsOfExperience !== undefined && (
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-600" />
                <span className="text-blue-700 font-medium">
                  You have {matchData.userYearsOfExperience} years of experience
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}