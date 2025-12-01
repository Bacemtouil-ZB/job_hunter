// client/components/dashboard/JobTypeChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Briefcase } from 'lucide-react';

interface JobTypeData {
  name: string;
  value: number;
  [key: string]: unknown;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function JobTypeChart() {
  const [data, setData] = useState<JobTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/dashboard/api/job-type-distribution')
      .then(res => res.json())
      .then(result => setData(result.data || []))
      .finally(() => setLoading(false));
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) return (
    <div className="h-full flex flex-col bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-semibold text-gray-800">Types of Employment</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
      </div>
    </div>
  );

  if (data.length === 0) return (
    <div className="h-full flex flex-col bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-semibold text-gray-800">Types of Employment</h3>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">No data available</div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-semibold text-gray-800">Types of Employment</h3>
        </div>
        <span className="text-xs font-bold text-gray-600">{total}</span>
      </div>
      
      <div className="flex-1 flex items-stretch px-4 pb-4 min-h-0">
        <div className="w-1/2 h-full min-h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius="60%" outerRadius="85%" paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{payload[0].name}</p>
                  <p className="text-xs text-gray-600">{payload[0].value} emplois</p>
                </div>
              ) : null} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-1/2 pl-2 space-y-1 overflow-y-auto max-h-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-medium text-gray-700 truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-xs font-bold text-gray-900">{item.value}</span>
                <span className="text-xs text-gray-500">({((item.value / total) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}