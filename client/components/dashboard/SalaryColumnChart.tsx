// client/components/dashboard/SalaryColumnChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign } from 'lucide-react';

interface SalaryData {
  jobType: string;
  averageSalary: number;
  count: number;
}

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

export default function SalaryColumnChart() {
  const [data, setData] = useState<SalaryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/dashboard/api/average-salary')
      .then(res => res.json())
      .then(result => setData(result.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-full w-full flex flex-col bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="w-4 h-4 text-green-600" />
        <h3 className="text-xs font-semibold text-gray-800">Average Salary</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-600"></div>
      </div>
    </div>
  );

  if (data.length === 0) return (
    <div className="h-full w-full flex flex-col bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="w-4 h-4 text-green-600" />
        <h3 className="text-xs font-semibold text-gray-800">Average Salary</h3>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">No data available</div>
    </div>
  );

  const maxSalary = Math.max(...data.map(d => d.averageSalary));

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <h3 className="text-xs font-semibold text-gray-800">Average Salary by Type</h3>
        </div>
        <span className="text-xs font-bold text-gray-600">{data.length} types</span>
      </div>
      
      <div className="flex-1 px-4 pb-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="jobType" 
              tick={{ fontSize: 10 }}
              stroke="#9ca3af"
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              stroke="#9ca3af"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              content={({ active, payload }) => active && payload?.[0] ? (
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{payload[0].payload.jobType}</p>
                  <p className="text-xs text-green-600 font-bold">{payload[0].value?.toLocaleString()} DT</p>
                  <p className="text-xs text-gray-500">{payload[0].payload.count} emplois</p>
                </div>
              ) : null}
            />
            <Bar dataKey="averageSalary" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[Math.floor((entry.averageSalary / maxSalary) * (COLORS.length - 1))]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}