// client/app/dashboard/page.tsx
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import JobTypeChart from '@/components/dashboard/JobTypeChart';
import SkillBarChart from '@/components/dashboard/SkillBarChart';
import SalaryColumnChart from '@/components/dashboard/SalaryColumnChart';
import ApplicationRateCard from '@/components/dashboard/ApplicationRateCard';
import GeographicMap from '@/components/dashboard/GeographicMap';
import PublicationLineChart from '@/components/dashboard/PublicationLineChart';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function DashboardPage() {
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="space-y-6">
          
          {/* Hero KPI Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Key Performance Indicators</h2>
            </div>
            <ApplicationRateCard />
          </div>

          {/* Main Grid Layout - 2 Rows */}
          <div className="space-y-6">
            
            {/* Top Row: Tendances (60%) + Salaires (40%) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Publication Trends - 60% */}
              <div className="lg:col-span-3 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Publishing Trends</h3>
                  </div>
                  <div className="h-[450px]">
                    <PublicationLineChart />
                  </div>
                </div>
              </div>

              {/* Salary Chart - 40% */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="h-[450px]">
                    <SalaryColumnChart />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Types (33%) + Skills (33%) + Map (33% but visually 40% content) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Job Types */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                  
                  <div className="h-[340px]">
                    <JobTypeChart />
                  </div>
                </div>
              </div>

              {/* Skills Chart */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                
                  <div className="h-[340px]">
                    <SkillBarChart />
                  </div>
                </div>
              </div>

              {/* Geographic Map */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                 
                  <div className="h-[340px]">
                    <GeographicMap />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
}