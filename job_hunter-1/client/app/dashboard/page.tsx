// client/app/dashboard/page.tsx
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import JobTypeChart from '@/components/dashboard/JobTypeChart';
import SkillBarChart from '@/components/dashboard/SkillBarChart';
import PublicationLineChart from '@/components/dashboard/PublicationLineChart';
import SalaryColumnChart from '@/components/dashboard/SalaryColumnChart';
import ApplicationRateCard from '@/components/dashboard/ApplicationRateCard';
import GeographicMap from '@/components/dashboard/GeographicMap';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Compact Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>

          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live</span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid - Fixed Height, No Scroll */}
      <div className="h-[calc(100vh-160px)] grid grid-cols-12 gap-3">
        
        {/* Top Row - KPI Cards */}
        <div className="col-span-12 h-[22%]">
          <ApplicationRateCard />
        </div>

        {/* Second Row - 3 Charts */}
        <div className="col-span-4 h-[38%]">
          <JobTypeChart />
        </div>
        <div className="col-span-4 h-[38%]">
          <SalaryColumnChart />
        </div>
        <div className="col-span-4 h-[38%]">
          <SkillBarChart />
        </div>

        {/* Third Row - 2 Charts */}
        <div className="col-span-6 h-[38%]">
          <PublicationLineChart />
        </div>
        <div className="col-span-6 h-[38%]">
          <GeographicMap />
        </div>
      </div>
    </DashboardLayout>
  );
}

