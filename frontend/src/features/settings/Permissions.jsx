import React from 'react';
import { Lock, Shield, Check, X, Users, BookOpen, CreditCard, Settings } from 'lucide-react';

const ROLES = [
  { role: 'Super Admin', color: 'bg-rose-100 text-rose-700' },
  { role: 'Admin', color: 'bg-orange-100 text-orange-700' },
  { role: 'Teacher', color: 'bg-blue-100 text-blue-700' },
  { role: 'Staff', color: 'bg-green-100 text-green-700' },
];

const PERMISSIONS = [
  { module: 'Dashboard', icon: Settings, perms: [true, true, true, true] },
  { module: 'Students', icon: Users, perms: [true, true, true, false] },
  { module: 'Courses', icon: BookOpen, perms: [true, true, true, false] },
  { module: 'Attendance', icon: Check, perms: [true, true, true, true] },
  { module: 'Payments & Finance', icon: CreditCard, perms: [true, true, false, false] },
  { module: 'Reports', icon: Lock, perms: [true, true, false, false] },
  { module: 'Settings', icon: Settings, perms: [true, false, false, false] },
  { module: 'User Management', icon: Users, perms: [true, false, false, false] },
  { module: 'Institutions', icon: Shield, perms: [true, false, false, false] },
];

const Permissions = () => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div>
      <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">Role Permissions</h1>
      <p className="text-slate-500 font-medium tracking-tight">View which roles have access to each module in the system.</p>
    </div>

    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-slate-100">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <Shield size={22} strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Access Matrix</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-48">Module</th>
              {ROLES.map((r) => (
                <th key={r.role} className="px-6 py-4 text-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${r.color}`}>
                    {r.role}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((p, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                      <p.icon size={14} className="text-slate-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{p.module}</span>
                  </div>
                </td>
                {p.perms.map((has, j) => (
                  <td key={j} className="px-6 py-4 text-center">
                    {has
                      ? <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center mx-auto"><Check size={14} className="text-emerald-500" strokeWidth={3} /></div>
                      : <div className="w-7 h-7 bg-rose-50 rounded-full flex items-center justify-center mx-auto"><X size={14} className="text-rose-400" strokeWidth={3} /></div>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-slate-50/50 flex items-center gap-6 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center">
            <Check size={10} className="text-emerald-500" strokeWidth={3} />
          </div>
          Access Granted
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center">
            <X size={10} className="text-rose-400" strokeWidth={3} />
          </div>
          No Access
        </div>
      </div>
    </div>
  </div>
);

export { Permissions };
export default Permissions;
