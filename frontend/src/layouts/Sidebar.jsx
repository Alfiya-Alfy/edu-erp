import { 
  LayoutDashboard, GraduationCap, Users, BookOpen, Layers, Award, 
  LogOut, Menu, X, FileText, ClipboardCheck, UserSquare2, 
  CreditCard, MessageSquare, PieChart, Settings, ShieldAlert 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
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
  );
};
