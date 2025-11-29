// client/components/dashboard/ApplicationRateCard.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface RateData {
  averageApplications: number;
  totalJobs: number;
  totalApplications: number;
}

export default function ApplicationRateCard() {
  const [data, setData] = useState<RateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/dashboard/api/application-rate');
        
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
        <h3 className="text-lg font-semibold mb-4">Taux de Candidature</h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Taux de Candidature</h3>
        <div className="text-red-500 text-center p-4">{error || 'Données non disponibles'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Taux de Candidature</h3>
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-5xl font-bold text-blue-600">{data.averageApplications}</p>
          <p className="text-gray-600 mt-2">Candidatures moyennes par offre</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-semibold text-blue-700">{data.totalJobs}</p>
            <p className="text-sm text-gray-600">Offres totales</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-semibold text-green-700">{data.totalApplications}</p>
            <p className="text-sm text-gray-600">Candidatures totales</p>
          </div>
        </div>
      </div>
    </div>
  );
}