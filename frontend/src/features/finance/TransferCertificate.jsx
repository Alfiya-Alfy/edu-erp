import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  Plus, Search, CheckCircle, FileText, Shield, Clock, RefreshCw, Eye, Printer, CheckCircle2
} from 'lucide-react';
import { Table } from '../../components/common/Table';
import Button from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as tcApi from '../../api/tcApi';

// ─── TC PDF/Print Generator ────────────────────────────────────────────────────
const generateTcPDF = (tc) => {
    const issueDate = tc.issue_date
        ? new Date(tc.issue_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'N/A';
    const studentName = tc.student_name || `Student ID: STU-${String(tc.student_id).padStart(3, '0')}`;
    const issuedBy = tc.issued_by || 'Principal';
    const tcNum = tc.tc_number || 'N/A';
    const reason = tc.reason || 'As per student/parent request';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Transfer Certificate - ${tcNum}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700;900&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#fff; display:flex; justify-content:center; align-items:center; min-height:100vh; padding:40px; }
    .doc { width:760px; border:2px solid #1e40af; padding:50px 60px; background:linear-gradient(180deg,#f0f9ff 0%,#fff 100%); box-shadow:0 20px 60px rgba(0,0,0,0.12); }
    .header { text-align:center; border-bottom:3px double #1e40af; padding-bottom:24px; margin-bottom:28px; }
    .inst { font-size:22px; font-weight:900; color:#1e40af; letter-spacing:2px; text-transform:uppercase; }
    .tc-title { font-family:'EB Garamond',serif; font-size:32px; font-weight:700; color:#0f172a; margin:10px 0 4px; }
    .tc-no { font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#64748b; }
    .body-section { margin-bottom:22px; }
    .label { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#94a3b8; margin-bottom:4px; }
    .value { font-size:16px; font-weight:600; color:#0f172a; font-family:'EB Garamond',serif; }
    .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:22px; }
    .field { background:#f8fafc; padding:16px 20px; border-radius:12px; border-left:3px solid #1e40af; }
    .reason-box { background:#f8fafc; padding:20px; border-radius:12px; border-left:3px solid #0ea5e9; margin-bottom:30px; }
    .status-badge { display:inline-block; padding:4px 16px; border-radius:99px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; background:${tc.status === 'issued' ? '#d1fae5' : '#fef3c7'}; color:${tc.status === 'issued' ? '#065f46' : '#92400e'}; }
    .footer { display:flex; justify-content:space-between; padding-top:30px; border-top:1px solid #e2e8f0; margin-top:20px; }
    .sig { text-align:center; }
    .sig-line { width:140px; border-top:1.5px solid #334155; margin-bottom:6px; }
    .sig-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748b; }
    .watermark { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg); font-size:80px; font-weight:900; color:rgba(30,64,175,0.04); pointer-events:none; z-index:0; letter-spacing:8px; text-transform:uppercase; }
    @media print { body { padding:0; min-height:auto; } .doc { box-shadow:none; } }
  </style>
</head>
<body>
  <div class="watermark">TRANSFER CERTIFICATE</div>
  <div class="doc">
    <div class="header">
      <div class="inst">EduERP Institution</div>
      <div class="tc-title">Transfer Certificate</div>
      <div class="tc-no">TC No: ${tcNum}</div>
    </div>
    <div class="grid2">
      <div class="field">
        <div class="label">Student Name</div>
        <div class="value">${studentName}</div>
      </div>
      <div class="field">
        <div class="label">Issue Date</div>
        <div class="value">${issueDate}</div>
      </div>
      <div class="field">
        <div class="label">Issued By</div>
        <div class="value">${issuedBy}</div>
      </div>
      <div class="field">
        <div class="label">Status</div>
        <div class="value"><span class="status-badge">${tc.status || 'pending'}</span></div>
      </div>
    </div>
    <div class="reason-box">
      <div class="label" style="margin-bottom:8px;">Reason for Transfer</div>
      <div class="value" style="font-size:15px;">${reason}</div>
    </div>
    <div class="footer">
      <div class="sig">
        <div class="sig-line"></div>
        <div class="sig-label">${issuedBy}</div>
        <div class="sig-label" style="font-weight:400;margin-top:2px;">Authorized Signatory</div>
      </div>
      <div class="sig">
        <div class="sig-line"></div>
        <div class="sig-label">Principal</div>
        <div class="sig-label" style="font-weight:400;margin-top:2px;">Head of Institution</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) win.addEventListener('load', () => setTimeout(() => win.print(), 500));
};

// ─── Component ────────────────────────────────────────────────────────────────
const TransferCertificate = () => {
    const { currentInstitution } = useAuth();
    const { addToast } = useToast();

    const [allTcs, setAllTcs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTc, setEditingTc] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingTc, setViewingTc] = useState(null);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [newTc, setNewTc] = useState({
        student_id: '',
        tc_number: '',
        issued_by: '',
        issue_date: new Date().toISOString().split('T')[0],
        reason: '',
        status: 'pending'
    });
    const [stats, setStats] = useState({ total: 0, pending: 0, issued: 0 });

    const fetchTcs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await tcApi.getTransferCertificates({ institution_id: currentInstitution?.id });
            const data = res.data || [];
            setAllTcs(data);
            setStats({
                total: data.length,
                pending: data.filter(r => r.status === 'pending').length,
                issued: data.filter(r => r.status === 'issued').length
            });
        } catch (error) {
            addToast("Failed to load TC records", "error");
        } finally {
            setLoading(false);
        }
    }, [currentInstitution, addToast]);

    useEffect(() => { fetchTcs(); }, [fetchTcs]);

    const handleMarkIssued = async (id) => {
        try {
            await tcApi.updateTcStatus(id, 'issued');
            toast.success("TC marked as issued!");
            fetchTcs();
        } catch {
            toast.error("Failed to update TC status");
        }
    };

    const handleDelete = async (r) => {
        if (!window.confirm(`Delete TC record ${r.tc_number}?`)) return;
        try {
            await tcApi.deleteTc(r.tc_id);
            toast.success("TC deleted");
            fetchTcs();
        } catch {
            setAllTcs(prev => prev.filter(tc => tc.tc_id !== r.tc_id));
            toast.success("TC removed");
        }
    };

    const openEditModal = (r) => {
        setEditingTc({ ...r, issue_date: r.issue_date ? new Date(r.issue_date).toISOString().split('T')[0] : '' });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await tcApi.updateTc(editingTc.tc_id, {
                tc_number: editingTc.tc_number,
                issued_by: editingTc.issued_by,
                issue_date: editingTc.issue_date,
                reason: editingTc.reason,
                status: editingTc.status
            });
            toast.success("TC updated!");
            setIsEditModalOpen(false);
            fetchTcs();
        } catch {
            setAllTcs(prev => prev.map(tc => tc.tc_id === editingTc.tc_id ? { ...tc, ...editingTc } : tc));
            toast.success("TC updated (local)");
            setIsEditModalOpen(false);
        }
    };

    const handleGenerateSubmit = async (e) => {
        e.preventDefault();
        if (!newTc.student_id || !newTc.tc_number) {
            toast.error("Student ID and TC Number are required");
            return;
        }
        setGenerating(true);
        try {
            await tcApi.createTransferCertificate({ ...newTc, institution_id: currentInstitution?.id || 1 });
            toast.success("Transfer Certificate generated!");
            setIsGenerateModalOpen(false);
            setNewTc({ student_id: '', tc_number: '', issued_by: '', issue_date: new Date().toISOString().split('T')[0], reason: '', status: 'pending' });
            fetchTcs();
        } catch (err) {
            toast.error("Failed to generate TC. Check student ID.");
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const columns = [
        {
            header: 'TC Number', accessor: 'tc_number',
            render: (r) => <span className="font-black text-indigo-600 text-[10px] uppercase tracking-tighter bg-indigo-50 px-2 py-1 rounded-lg">{r.tc_number}</span>
        },
        {
            header: 'Student', accessor: 'student_id',
            render: (r) => (
                <div>
                    <span className="text-xs font-bold text-slate-700">{r.student_name || `STU-${String(r.student_id).padStart(3,'0')}`}</span>
                    <span className="block text-[10px] text-slate-400">ID: {r.student_id}</span>
                </div>
            )
        },
        {
            header: 'Reason', accessor: 'reason',
            render: (r) => <span className="text-xs text-slate-500 font-medium line-clamp-1 max-w-[200px]">{r.reason}</span>
        },
        {
            header: 'Issue Date', accessor: 'issue_date',
            render: (r) => <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(r.issue_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        },
        {
            header: 'Status', accessor: 'status',
            render: (r) => (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${r.status === 'issued' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {r.status}
                </div>
            )
        }
    ];

    const filteredTcs = allTcs.filter(r =>
        (r.tc_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.reason || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.student_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(r.student_id).includes(searchQuery)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">Transfer Certificates</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Managing student departures for <span className="text-primary font-bold">{currentInstitution?.name || 'Main Campus'}</span>.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={fetchTcs} icon={RefreshCw}>Sync</Button>
                    <Button icon={Plus} onClick={() => setIsGenerateModalOpen(true)}>Generate TC</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={FileText} label="Total TCs" value={stats.total} color="#2563eb" bg="bg-blue-50" />
                <StatCard icon={Clock} label="Pending Issue" value={stats.pending} color="#f59e0b" bg="bg-amber-50" />
                <StatCard icon={CheckCircle2} label="Issued" value={stats.issued} color="#10b981" bg="bg-emerald-50" />
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-2">
                <div className="flex items-center justify-between p-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><FileText size={24} strokeWidth={2.5} /></div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">TC Records</h2>
                    </div>
                    <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" placeholder="Search tc no, student, reason..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-primary/20 transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={filteredTcs}
                    loading={loading}
                    actions={true}
                    renderActions={(r) => (
                        <div className="flex justify-end gap-1">
                            {r.status === 'pending' && (
                                <button onClick={() => handleMarkIssued(r.tc_id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Mark Issued">
                                    <CheckCircle size={16} strokeWidth={2.5} />
                                </button>
                            )}
                            <button onClick={() => { setViewingTc(r); setIsViewModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="View TC">
                                <Eye size={16} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => generateTcPDF(r)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all" title="Print / Download TC">
                                <Printer size={16} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => openEditModal(r)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Edit TC">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                            </button>
                            <button onClick={() => handleDelete(r)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete TC">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    )}
                    pagination={true}
                    totalPages={1}
                />
            </div>

            {/* ── Generate New TC Modal ── */}
            <Modal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} title="Generate Transfer Certificate">
                <form onSubmit={handleGenerateSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Student ID <span className="text-rose-500">*</span></label>
                            <input type="number" placeholder="e.g. 1" value={newTc.student_id} onChange={e => setNewTc({ ...newTc, student_id: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">TC Number <span className="text-rose-500">*</span></label>
                            <input type="text" placeholder="e.g. TC-2024-001" value={newTc.tc_number} onChange={e => setNewTc({ ...newTc, tc_number: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Issued By</label>
                            <input type="text" placeholder="e.g. Principal Name" value={newTc.issued_by} onChange={e => setNewTc({ ...newTc, issued_by: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date</label>
                            <input type="date" value={newTc.issue_date} onChange={e => setNewTc({ ...newTc, issue_date: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Transfer <span className="text-rose-500">*</span></label>
                        <textarea value={newTc.reason} onChange={e => setNewTc({ ...newTc, reason: e.target.value })} placeholder="Reason for leaving the institution..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none h-20" required />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => setIsGenerateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" loading={generating}>Generate TC</Button>
                    </div>
                </form>
            </Modal>

            {/* ── Edit Modal ── */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Transfer Certificate">
                {editingTc && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">TC Number</label>
                                <input type="text" value={editingTc.tc_number || ''} onChange={e => setEditingTc({ ...editingTc, tc_number: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Issued By</label>
                                <input type="text" value={editingTc.issued_by || ''} onChange={e => setEditingTc({ ...editingTc, issued_by: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date</label>
                                <input type="date" value={editingTc.issue_date || ''} onChange={e => setEditingTc({ ...editingTc, issue_date: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                                <select value={editingTc.status || 'pending'} onChange={e => setEditingTc({ ...editingTc, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none h-11">
                                    <option value="pending">pending</option>
                                    <option value="issued">issued</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Transfer</label>
                            <textarea value={editingTc.reason || ''} onChange={e => setEditingTc({ ...editingTc, reason: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none h-20" required />
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* ── View Modal ── */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Transfer Certificate Details">
                {viewingTc && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                <FileText size={22} strokeWidth={2.5} className="text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800">{viewingTc.tc_number || 'N/A'}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transfer Certificate</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Student</span>
                                <span className="text-sm font-bold text-slate-800">{viewingTc.student_name || `STU-${String(viewingTc.student_id).padStart(3,'0')}`}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Issued By</span>
                                <span className="text-sm font-bold text-slate-800">{viewingTc.issued_by || '—'}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl col-span-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Issue Date</span>
                                <span className="text-sm font-bold text-slate-800">{viewingTc.issue_date ? new Date(viewingTc.issue_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Reason</span>
                            <span className="text-xs text-slate-700 font-medium whitespace-pre-line">{viewingTc.reason || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${viewingTc.status === 'issued' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>{viewingTc.status || 'pending'}</span>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => generateTcPDF(viewingTc)} icon={Printer}>Print/Download</Button>
                                <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                <Icon size={20} color={color} strokeWidth={2.5} />
            </div>
        </div>
        <p className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">{value}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
);

export default TransferCertificate;
