import ViewsChart from "../../components/ViewsChart";
import AICoach from "../../components/AICoach"; // (Adjust path if needed!)

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="text-gray-500">Here is how your content is performing today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Views</p>
          <p className="text-3xl font-bold mt-2">124,500</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
            +12% vs last week
          </span>
        </div>

        {/* Stat Card 2 */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Avg. Watch Time</p>
          <p className="text-3xl font-bold mt-2">4m 12s</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs text-red-700 bg-red-100 rounded-full">
            -2% vs last week
          </span>
        </div>

        {/* Stat Card 3 (AI Insight Placeholder) */}
        <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm text-indigo-800 font-bold mb-1">🤖 AI Insight</p>
            <p className="text-indigo-900 font-medium leading-relaxed">
              "Your retention drops at 0:30. Try adding a visual pattern interrupt there."
            </p>
          </div>
        </div>
      </div>
      
      {/* Placeholder for Chart */}
      {/* Chart Area */}
{/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-1 overflow-hidden h-96">
          <ViewsChart />
        </div>

        {/* AI Coach Section (Takes up 1 column) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96">
          <AICoach />
        </div>
        
      </div>
    </div>
  );
}