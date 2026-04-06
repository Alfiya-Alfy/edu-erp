import { GraduationCap, Users, BookOpen, Layers, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Academic Dashboard
 * Provides key metrics and quick navigation for the Academic module.
 */
export const Dashboard = () => {
  const stats = [
    { label: "Total Students", value: "1,240", icon: GraduationCap, color: "bg-blue-500", trend: "+12% vs last month" },
    { label: "Active Batches", value: "32", icon: Layers, color: "bg-indigo-500", trend: "4 new this week" },
    { label: "Faculty Members", value: "48", icon: Users, color: "bg-purple-500", trend: "All present today" },
    { label: "Total Courses", value: "14", icon: BookOpen, color: "bg-emerald-500", trend: "2 pending review" },
  ];

  const recentActivity = [
    { id: 1, title: "New Admission", detail: "Amal Nath joined BCA Batch 2023", time: "2 hours ago", type: "admission" },
    { id: 2, title: "Placement Update", detail: "5 students placed at TechCorp", time: "5 hours ago", type: "placement" },
    { id: 3, title: "Course Added", detail: "Advanced React.js module created", time: "Yesterday", type: "course" },
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Academic Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">April 2, 2026</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] transition-transform duration-500 group-hover:scale-110 ${stat.color}`}></div>
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} />
                <span>Steady</span>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
              <p className="text-xs text-gray-500 mt-2 font-medium">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <ArrowRight size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900">{activity.title}</h4>
                    <span className="text-xs font-medium text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: "New Admission", path: "/admission", icon: GraduationCap },
              { label: "Manage Batches", path: "/batches", icon: Layers },
              { label: "Student List", path: "/students", icon: Users },
              { label: "Course Catalog", path: "/courses", icon: BookOpen },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
              >
                <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <link.icon size={20} />
                </div>
                <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors">{link.label}</span>
                <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
