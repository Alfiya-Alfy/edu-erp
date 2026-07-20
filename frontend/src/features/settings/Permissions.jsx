import React, { useState } from 'react';
import { Shield, Search, Lock, CheckCircle2 } from 'lucide-react';

export const Permissions = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const permissionGroups = [
        {
            module: "Student Management",
            permissions: [
                { name: "view_students", desc: "Allows viewing student directories, personal profiles, and records.", role: "Admin, Staff, Teacher" },
                { name: "edit_students", desc: "Allows editing student details and modifying academic bio-data.", role: "Admin, Staff" },
                { name: "delete_students", desc: "Allows purging student entries permanently from database registry.", role: "Admin" }
            ]
        },
        {
            module: "Finance & Payments",
            permissions: [
                { name: "view_payments", desc: "Allows viewing transaction logs, receipts, invoice histories.", role: "Admin, Staff, Parent" },
                { name: "collect_fees", desc: "Allows generating payments, issuing receipts, recording offline transactions.", role: "Admin, Staff" },
                { name: "manage_fees", desc: "Allows modifying fee structure tables and discount categories.", role: "Admin" }
            ]
        },
        {
            module: "Documents Registry",
            permissions: [
                { name: "view_documents", desc: "Allows reading academic logs, certificates, and TC audits.", role: "Admin, Staff, Teacher" },
                { name: "issue_documents", desc: "Allows issuing certificates, generating transfer certificates.", role: "Admin, Staff" }
            ]
        }
    ];

    const filteredGroups = permissionGroups.map(group => ({
        ...group,
        permissions: group.permissions.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(group => group.permissions.length > 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">System Permissions</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Security rules and functional permission mappings across role groups.</p>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                            <Shield size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Registered Policy Permissions</h2>
                    </div>
                    <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search permission policies..." 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {filteredGroups.map((group, idx) => (
                        <div key={idx} className="border border-slate-100 rounded-3xl p-6 bg-slate-50/50 space-y-4">
                            <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">{group.module}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {group.permissions.map((p, pidx) => (
                                    <div key={pidx} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start gap-3 shadow-xs">
                                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg mt-0.5">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <div className="space-y-1">
                                            <code className="text-xs font-black text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md font-mono">{p.name}</code>
                                            <p className="text-xs font-medium text-slate-500 leading-relaxed">{p.desc}</p>
                                            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Assigned: {p.role}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Permissions;
