import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Eye, 
  Printer, 
  Award, 
  Shield, 
  Star, 
  CheckCircle2, 
  RefreshCw,
  Download,
  X
} from 'lucide-react';
import { Table } from '../../components/common/Table';
import Button from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as certificateApi from '../../api/certificateApi';

// ─── PDF/Print Helper ─────────────────────────────────────────────────────────
const generateCertificatePDF = (cert) => {
    const issueDate = cert.issued_date
        ? new Date(cert.issued_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'N/A';
    const studentName = cert.student_name || `Student ID: STU-${String(cert.student_id).padStart(3, '0')}`;
    const certType = cert.certificate_type || 'Certificate';
    const issuedBy = cert.issued_by || 'Principal';
    const certNo = cert.certificate_no || 'N/A';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${certType} - ${certNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 40px; }
    .certificate {
      width: 800px; min-height: 560px;
      border: 16px double #1e3a8a;
      padding: 50px 60px;
      text-align: center;
      position: relative;
      background: linear-gradient(135deg, #f8faff 0%, #fff 50%, #f0f4ff 100%);
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
    .corner { position: absolute; width: 60px; height: 60px; }
    .corner.tl { top: 8px; left: 8px; border-top: 4px solid #1e3a8a; border-left: 4px solid #1e3a8a; }
    .corner.tr { top: 8px; right: 8px; border-top: 4px solid #1e3a8a; border-right: 4px solid #1e3a8a; }
    .corner.bl { bottom: 8px; left: 8px; border-bottom: 4px solid #1e3a8a; border-left: 4px solid #1e3a8a; }
    .corner.br { bottom: 8px; right: 8px; border-bottom: 4px solid #1e3a8a; border-right: 4px solid #1e3a8a; }
    .emblem { font-size: 48px; margin-bottom: 8px; }
    .inst-name { font-size: 13px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #1e3a8a; margin-bottom: 20px; }
    .divider { width: 200px; height: 2px; background: linear-gradient(90deg, transparent, #1e3a8a, transparent); margin: 0 auto 20px; }
    .cert-title { font-family: 'EB Garamond', serif; font-size: 42px; font-weight: 700; color: #1e3a8a; margin-bottom: 6px; letter-spacing: 2px; }
    .cert-subtitle { font-size: 11px; letter-spacing: 6px; text-transform: uppercase; color: #64748b; margin-bottom: 30px; }
    .body-text { font-family: 'EB Garamond', serif; font-size: 18px; color: #475569; line-height: 1.8; margin-bottom: 30px; }
    .name { font-size: 34px; font-weight: 700; color: #1e293b; font-family: 'EB Garamond', serif; font-style: italic; border-bottom: 2px solid #1e3a8a; display: inline-block; padding-bottom: 4px; margin: 6px 0 12px; }
    .cert-no { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase; margin-bottom: 30px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .sig-block { text-align: center; }
    .sig-line { width: 160px; border-top: 1.5px solid #334155; margin-bottom: 6px; }
    .sig-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #64748b; }
    .seal { width: 80px; height: 80px; border-radius: 50%; border: 3px solid #1e3a8a; display: flex; align-items: center; justify-content: center; flex-direction: column; }
    .seal-text { font-size: 8px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #1e3a8a; text-align: center; line-height: 1.3; }
    @media print { body { padding: 0; min-height: auto; } .certificate { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="corner tl"></div>
    <div class="corner tr"></div>
    <div class="corner bl"></div>
    <div class="corner br"></div>
    <div class="emblem">🎓</div>
    <div class="inst-name">EduERP Institution</div>
    <div class="divider"></div>
    <div class="cert-title">Certificate</div>
    <div class="cert-subtitle">of ${certType}</div>
    <div class="body-text">
      This is to certify that
    </div>
    <div class="name">${studentName}</div>
    <div class="cert-no">Certificate No: ${certNo}</div>
    <div class="body-text">
      has been duly recognized and this certificate is issued on <strong>${issueDate}</strong>.
    </div>
    <div class="footer">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-label">${issuedBy}</div>
        <div class="sig-label" style="font-weight:400;margin-top:2px;">Authorized Signatory</div>
      </div>
      <div class="seal">
        <div class="seal-text">OFFICIAL<br/>SEAL<br/>✦</div>
      </div>
      <div class="sig-block">
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
    if (win) {
        win.addEventListener('load', () => {
            setTimeout(() => win.print(), 500);
        });
    }
};

// ─── Component ────────────────────────────────────────────────────────────────
const Certificates = () => {
    const { currentInstitution } = useAuth();
    const { addToast } = useToast();
    
    const [allCertificates, setAllCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingCert, setViewingCert] = useState(null);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [newCert, setNewCert] = useState({
        student_id: '',
        certificate_type: 'Bonafide',
        certificate_no: '',
        issued_by: '',
        issued_date: new Date().toISOString().split('T')[0],
        status: 'issued'
    });
    const [issuing, setIssuing] = useState(false);
    const [stats, setStats] = useState({ total: 0, bonafide: 0, completion: 0, cancelled: 0 });

    const fetchCertificates = useCallback(async () => {
        setLoading(true);
        try {
            const res = await certificateApi.getCertificates({ institution_id: currentInstitution?.id });
            const data = res.data || [];
            setAllCertificates(data);
            setStats({
                total: data.length,
                bonafide: data.filter(r => r.certificate_type === 'Bonafide').length,
                completion: data.filter(r => r.certificate_type === 'Course Completion').length,
                cancelled: data.filter(r => r.status === 'cancelled').length
            });
        } catch (error) {
            console.error("Failed to fetch certificates:", error);
            addToast("Failed to load certificate records", "error");
        } finally {
            setLoading(false);
        }
    }, [currentInstitution, addToast]);

    useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

    const handleDelete = async (r) => {
        if (!window.confirm(`Delete certificate ${r.certificate_no}?`)) return;
        try {
            await certificateApi.deleteCertificate(r.certification_id);
            toast.success("Certificate deleted");
            fetchCertificates();
        } catch {
            setAllCertificates(prev => prev.filter(c => c.certification_id !== r.certification_id));
            toast.success("Certificate removed");
        }
    };

    const openEditModal = (r) => {
        setEditingCert({ ...r, issued_date: r.issued_date ? new Date(r.issued_date).toISOString().split('T')[0] : '' });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await certificateApi.updateCertificate(editingCert.certification_id, {
                certificate_type: editingCert.certificate_type,
                certificate_no: editingCert.certificate_no,
                issued_by: editingCert.issued_by,
                issued_date: editingCert.issued_date,
                status: editingCert.status
            });
            toast.success("Certificate updated!");
            setIsEditModalOpen(false);
            fetchCertificates();
        } catch {
            setAllCertificates(prev => prev.map(c => c.certification_id === editingCert.certification_id ? { ...c, ...editingCert } : c));
            toast.success("Certificate updated (local)");
            setIsEditModalOpen(false);
        }
    };

    const handleIssueSubmit = async (e) => {
        e.preventDefault();
        if (!newCert.student_id || !newCert.certificate_no) {
            toast.error("Student ID and Certificate No are required");
            return;
        }
        setIssuing(true);
        try {
            await certificateApi.createCertificate({ ...newCert, institution_id: currentInstitution?.id || 1 });
            toast.success("Certificate issued successfully!");
            setIsIssueModalOpen(false);
            setNewCert({ student_id: '', certificate_type: 'Bonafide', certificate_no: '', issued_by: '', issued_date: new Date().toISOString().split('T')[0], status: 'issued' });
            fetchCertificates();
        } catch (err) {
            toast.error("Failed to issue certificate. Check student ID.");
            console.error(err);
        } finally {
            setIssuing(false);
        }
    };

    const handlePrint = (r) => generateCertificatePDF(r);

    const columns = [
        {
            header: 'Certificate No', accessor: 'certificate_no',
            render: (r) => <span className="font-black text-primary text-[10px] uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded-lg">{r.certificate_no}</span>
        },
        {
            header: 'Student', accessor: 'student_id',
            render: (r) => (
                <div>
                    <span className="text-xs font-bold text-slate-700">{r.student_name || `STU-${String(r.student_id).padStart(3, '0')}`}</span>
                    <span className="block text-[10px] text-slate-400">ID: {r.student_id}</span>
                </div>
            )
        },
        {
            header: 'Type', accessor: 'certificate_type',
            render: (r) => (
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${r.certificate_type === 'Course Completion' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                    {r.certificate_type === 'Course Completion' ? '🎓 Course' : '📋 Bonafide'}
                </span>
            )
        },
        {
            header: 'Issue Date', accessor: 'issued_date',
            render: (r) => <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(r.issued_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        },
        {
            header: 'Status', accessor: 'status',
            render: (r) => (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${r.status === 'issued' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {r.status}
                </div>
            )
        }
    ];

    const filteredCertificates = allCertificates.filter(r =>
        (r.certificate_no || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.student_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(r.student_id).includes(searchQuery)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">Academic Certificates</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Credentials and document issuance for <span className="text-primary font-bold">{currentInstitution?.name || 'Main Campus'}</span>.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={fetchCertificates} icon={RefreshCw}>Sync</Button>
                    <Button icon={Plus} onClick={() => setIsIssueModalOpen(true)}>Issue Certificate</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Award} label="Total Issued" value={stats.total} color="#2563eb" bg="bg-blue-50" />
                <StatCard icon={Star} label="Bonafide" value={stats.bonafide} color="#f59e0b" bg="bg-amber-50" />
                <StatCard icon={CheckCircle2} label="Completion" value={stats.completion} color="#10b981" bg="bg-emerald-50" />
                <StatCard icon={Shield} label="Cancelled" value={stats.cancelled} color="#ef4444" bg="bg-rose-50" />
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-2">
                <div className="flex items-center justify-between p-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl"><Star size={24} strokeWidth={2.5} /></div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Issued Documents</h2>
                    </div>
                    <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" placeholder="Search cert no, student..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-primary/20 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredCertificates}
                    loading={loading}
                    actions={true}
                    renderActions={(r) => (
                        <div className="flex justify-end gap-1">
                            <button onClick={() => { setViewingCert(r); setIsViewModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="View Details">
                                <Eye size={16} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => handlePrint(r)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all" title="Print / Download Certificate">
                                <Printer size={16} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => openEditModal(r)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                            </button>
                            <button onClick={() => handleDelete(r)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    )}
                    pagination={true}
                    totalPages={1}
                />
            </div>

            {/* ── Issue New Certificate Modal ── */}
            <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Issue New Certificate">
                <form onSubmit={handleIssueSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Student ID <span className="text-rose-500">*</span></label>
                            <input type="number" placeholder="e.g. 1" value={newCert.student_id} onChange={e => setNewCert({ ...newCert, student_id: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Certificate No <span className="text-rose-500">*</span></label>
                            <input type="text" placeholder="e.g. CERT-2024-001" value={newCert.certificate_no} onChange={e => setNewCert({ ...newCert, certificate_no: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Certificate Type</label>
                            <select value={newCert.certificate_type} onChange={e => setNewCert({ ...newCert, certificate_type: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none h-11">
                                <option value="Bonafide">Bonafide</option>
                                <option value="Course Completion">Course Completion</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Issued By</label>
                            <input type="text" placeholder="e.g. Principal Name" value={newCert.issued_by} onChange={e => setNewCert({ ...newCert, issued_by: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date</label>
                            <input type="date" value={newCert.issued_date} onChange={e => setNewCert({ ...newCert, issued_date: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
                        <Button type="submit" loading={issuing}>Issue Certificate</Button>
                    </div>
                </form>
            </Modal>

            {/* ── Edit Modal ── */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Certificate Details">
                {editingCert && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Certificate No</label>
                                <input type="text" value={editingCert.certificate_no || ''} onChange={e => setEditingCert({ ...editingCert, certificate_no: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Certificate Type</label>
                                <select value={editingCert.certificate_type || 'Bonafide'} onChange={e => setEditingCert({ ...editingCert, certificate_type: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none h-11">
                                    <option value="Bonafide">Bonafide</option>
                                    <option value="Course Completion">Course Completion</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Issued By</label>
                                <input type="text" value={editingCert.issued_by || ''} onChange={e => setEditingCert({ ...editingCert, issued_by: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date</label>
                                <input type="date" value={editingCert.issued_date || ''} onChange={e => setEditingCert({ ...editingCert, issued_date: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                            <select value={editingCert.status || 'issued'} onChange={e => setEditingCert({ ...editingCert, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm font-semibold text-slate-700 outline-none h-11">
                                <option value="issued">issued</option>
                                <option value="cancelled">cancelled</option>
                            </select>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* ── View Modal ── */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Certificate Details">
                {viewingCert && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                <Award size={22} strokeWidth={2.5} className="text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800">{viewingCert.certificate_no || 'N/A'}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{viewingCert.certificate_type || 'Certificate'}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Student</span>
                                <span className="text-sm font-bold text-slate-800">{viewingCert.student_name || `STU-${String(viewingCert.student_id).padStart(3, '0')}`}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Issued By</span>
                                <span className="text-sm font-bold text-slate-800">{viewingCert.issued_by || '—'}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl col-span-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Issue Date</span>
                                <span className="text-sm font-bold text-slate-800">{viewingCert.issued_date ? new Date(viewingCert.issued_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${viewingCert.status === 'issued' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>{viewingCert.status || 'issued'}</span>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => handlePrint(viewingCert)} icon={Printer}>Print/Download</Button>
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
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                <Icon size={20} color={color} strokeWidth={2.5} />
            </div>
        </div>
        <p className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">{value}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
);

export default Certificates;
