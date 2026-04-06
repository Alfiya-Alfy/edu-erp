import { Bell, Search, User, Menu } from "lucide-react";

export const Navbar = ({ setSidebarOpen }) => {
  return (
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
  );
};
