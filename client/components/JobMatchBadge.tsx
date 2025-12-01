import React from 'react';
import { Sparkles } from 'lucide-react';

interface JobMatchBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const JobMatchBadge: React.FC<JobMatchBadgeProps> = ({ 
  percentage, 
  size = 'md',
  showLabel = true 
}) => {
  const getMatchColor = (percent: number) => {
    if (percent >= 80) return 'from-green-500 to-emerald-500';
    if (percent >= 60) return 'from-blue-500 to-cyan-500';
    if (percent >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getMatchBgColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-50 border-green-200';
    if (percent >= 60) return 'bg-blue-50 border-blue-200';
    if (percent >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getMatchTextColor = (percent: number) => {
    if (percent >= 80) return 'text-green-700';
    if (percent >= 60) return 'text-blue-700';
    if (percent >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${getMatchBgColor(percentage)} ${sizeClasses[size]}`}>
      <Sparkles 
        size={iconSizes[size]} 
        className={`bg-gradient-to-r ${getMatchColor(percentage)} bg-clip-text text-transparent`}
        fill="currentColor"
      />
      <span className={`font-semibold ${getMatchTextColor(percentage)}`}>
        {percentage}% Match
      </span>
    </div>
  );
};

export default JobMatchBadge;