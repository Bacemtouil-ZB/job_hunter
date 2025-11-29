// client/components/dashboard/SalaryColumnChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalaryData {
  jobType: string;
  averageSalary: number;
  count: number;
}

export default function SalaryColumnChart() {
  const [data, setData] = useState<SalaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/dashboard/api/average-salary');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Salaire Moyen par Type d&apos;Emploi</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Salaire Moyen par Type Emploi</h3>
        <div className="text-red-500 text-center p-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Salaire Moyen par Type d&apos;Emploi</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="jobType" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
          <Bar dataKey="averageSalary" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
