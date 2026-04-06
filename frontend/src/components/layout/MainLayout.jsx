import { 
  Bell, Search, User, LayoutDashboard, GraduationCap, Users, BookOpen, 
  Layers, Award, LogOut, Menu, X, FileText, ClipboardCheck, 
  UserSquare2, CreditCard, MessageSquare, PieChart, Settings, ShieldAlert 
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

/**
 * Main Layout for the ERP. 
 * Includes Sidebar (for navigation) and Navbar (for search/user profile).
 * Designed to be consistent and responsive.
 */
export const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuGroups = [
    {
      title: "General",
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      ]
    },
    {
      title: "Students",
      items: [
        { name: 'Students', icon: GraduationCap, path: '/students' },
        { name: 'Admission', icon: UserSquare2, path: '/admission' },
        { name: 'Parents', icon: Users, path: '/parents' },
        { name: 'Placement', icon: Award, path: '/placements' },
        { name: 'Certificates', icon: FileText, path: '/certificates' },
        { name: 'TC', icon: FileText, path: '/tc' },
      ]
    },
    {
      title: "Academic",
      items: [
        { name: 'Courses', icon: BookOpen, path: '/courses' },
        { name: 'Batch', icon: Layers, path: '/batches' },
      ]
    },
    {
      title: "Attendance",
      items: [
        { name: 'Student Attendance', icon: ClipboardCheck, path: '/attendance/student' },
        { name: 'Staff Attendance', icon: ClipboardCheck, path: '/attendance/staff' },
      ]
    },
    {
      title: "Staff",
      items: [
        { name: 'Staff', icon: UserSquare2, path: '/staff' },
      ]
    },
    {
      title: "Finance",
      items: [
        { name: 'Fee Structure', icon: CreditCard, path: '/finance/fees' },
        { name: 'Payments', icon: CreditCard, path: '/finance/payments' },
      ]
    },
    {
      title: "Communication",
      items: [
        { name: 'Communication', icon: MessageSquare, path: '/communication' },
      ]
    },
    {
      title: "Reports",
      items: [
        { name: 'Reports', icon: PieChart, path: '/reports' },
      ]
    },
    {
      title: "Settings",
      items: [
        { name: 'Institution', icon: Settings, path: '/settings/institution' },
        { name: 'Users', icon: Users, path: '/settings/users' },
        { name: 'Roles', icon: ShieldAlert, path: '/settings/roles' },
        { name: 'Permissions', icon: ShieldAlert, path: '/settings/permissions' },
      ]
    },
    {
      title: "Advanced",
      items: [
        { name: 'Merge Log', icon: Layers, path: '/advanced/merge-log' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-primary text-white transition-all duration-300 z-50 
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-20'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-blue-900/50">
          {(isSidebarOpen || !isSidebarOpen) && (
            <span className={`text-xl font-bold tracking-tight transition-opacity duration-200 ${!isSidebarOpen && 'md:opacity-0'}`}>
              EduERP
            </span>
          )}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all hidden md:block"
          >
            <Menu size={20} className={`transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-blue-800 rounded-lg transition-colors md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-6 mt-4 overflow-y-auto max-h-[calc(100vh-160px)] no-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {isSidebarOpen && (
                <p className="px-4 text-[10px] font-black text-blue-300/50 uppercase tracking-[0.2em] mb-2">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all ${
                    location.pathname === item.path 
                    ? 'bg-white/10 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-blue-100 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className="min-w-[20px]" />
                  <span className={`font-semibold text-sm whitespace-nowrap transition-opacity duration-200 ${!isSidebarOpen && 'md:opacity-0'}`}>
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 w-full px-4">
          <button className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-blue-100 hover:bg-red-500/20 hover:text-red-300 transition-all">
            <LogOut size={22} />
            <span className={`font-medium transition-opacity duration-200 ${!isSidebarOpen && 'md:opacity-0'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-xl md:hidden text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 max-w-lg relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full relative transition-all">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">Jyothika K M</p>
                <p className="text-xs text-gray-500">Academic Manager</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200">
                <User size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Overlay */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
