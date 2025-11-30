import React from 'react';
import { Sparkles, TrendingUp, Target } from 'lucide-react';

interface JobMatchBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function JobMatchBadge({ percentage, size = 'md', showLabel = true }: JobMatchBadgeProps) {
  const getColor = () => {
    if (percentage >= 80) return {
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      ring: 'ring-green-100'
    };
    if (percentage >= 60) return {
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      ring: 'ring-blue-100'
    };
    if (percentage >= 40) return {
      gradient: 'from-yellow-500 to-orange-600',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      ring: 'ring-yellow-100'
    };
    return {
      gradient: 'from-gray-400 to-gray-600',
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      ring: 'ring-gray-100'
    };
  };

  const getLabel = () => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Low Match';
  };

  const getIcon = () => {
    if (percentage >= 80) return <Sparkles size={sizeMap[size].icon} className="text-white" />;
    if (percentage >= 60) return <TrendingUp size={sizeMap[size].icon} className="text-white" />;
    return <Target size={sizeMap[size].icon} className="text-white" />;
  };

  const sizeMap = {
    sm: { padding: 'px-2 py-1', text: 'text-xs', icon: 12 },
    md: { padding: 'px-3 py-1.5', text: 'text-sm', icon: 14 },
    lg: { padding: 'px-4 py-2', text: 'text-base', icon: 16 }
  };

  const colors = getColor();

  return (
    <div className={`inline-flex items-center gap-2 ${sizeMap[size].padding} rounded-xl border-2 ${colors.border} ${colors.bg} ring-4 ${colors.ring} transition-all duration-200 hover:shadow-md`}>
      <div className={`flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br ${colors.gradient} shadow-sm`}>
        {getIcon()}
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-bold ${sizeMap[size].text} ${colors.text}`}>
          {percentage}%
        </span>
        {showLabel && (
          <>
            <span className={`${colors.text} opacity-50`}>•</span>
            <span className={`font-semibold ${sizeMap[size].text} ${colors.text}`}>
              {getLabel()}
            </span>
          </>
        )}
      </div>
    </div>
  );
}