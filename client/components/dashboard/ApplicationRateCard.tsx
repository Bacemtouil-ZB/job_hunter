// client/components/dashboard/ApplicationRateCard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {  Briefcase, Users, BarChart3 } from 'lucide-react';

interface RateData {
  averageApplications: number;
  totalJobs: number;
  totalApplications: number;
}

export default function ApplicationRateCard() {
  const [data, setData] = useState<RateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/dashboard/api/application-rate');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Jobs',
      value: data.totalJobs,
      icon: Briefcase,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
      
    },
    {
      title: 'Total Applications',
      value: data.totalApplications,
      icon: Users,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
    },
    {
      title: 'Avg Applications/Job',
      value: data.averageApplications.toFixed(1),
      icon: BarChart3,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-700',
  
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {card.title}
                </p>
                <p className={`text-3xl font-bold ${card.textColor} mb-2`}>
                  {card.value}
                </p>
                
              </div>
              <div className={`${card.bgColor} p-3 rounded-xl`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}