import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, CheckCircle, FileText, Shield, Clock } from 'lucide-react';
import AppTable from '../../components/shared/AppTable';
import AppModal from '../../components/shared/AppModal';
import AppInput from '../../components/shared/AppInput';
import AppButton from '../../components/shared/AppButton';
import Pagination from '../../components/shared/Pagination';

/* Schema: tc_id SERIAL PK, student_id UNIQUE INT, institution_id INT,
   tc_number UNIQUE VARCHAR, issued_by INT, issue_date DATE,
   reason TEXT, status VARCHAR (issued|pending) */

const INSTITUTION_ID = 1;
let NEXT_ID = 6;
let TC_SEQ = 6;
const mkTcNo = () => `TC-${new Date().getFullYear()}-${String(TC_SEQ++).padStart(4, '0')}`;

const INIT_DATA = [
    { tc_id: 1, student_id: 102, institution_id: INSTITUTION_ID, tc_number: 'TC-2026-0001', issued_by: 1, issue_date: '2026-04-01', reason: 'Moving to another city', status: 'issued' },
    { tc_id: 2, student_id: 106, institution_id: INSTITUTION_ID, tc_number: 'TC-2026-0002', issued_by: 2, issue_date: '2026-03-28', reason: 'Joining different college', status: 'pending' },
    { tc_id: 3, student_id: 109, institution_id: INSTITUTION_ID, tc_number: 'TC-2026-0003', issued_by: 1, issue_date: '2026-03-20', reason: 'Family relocation', status: 'issued' },
    { tc_id: 4, student_id: 111, institution_id: INSTITUTION_ID, tc_number: 'TC-2026-0004', issued_by: 3, issue_date: '2026-03-15', reason: 'Personal reasons', status: 'pending' },
    { tc_id: 5, student_id: 113, institution_id: INSTITUTION_ID, tc_number: 'TC-2026-0005', issued_by: 2, issue_date: '2026-03-10', reason: 'Higher studies abroad', status: 'issued' },
];

const PAGE_SIZE = 5;
const emptyForm = { student_id: '', issued_by: '', reason: '', issue_date: '' };

function validate(f) {
    const e = {};
    if (!String(f.student_id).trim()) e.student_id = 'Student ID is required';
    if (!f.reason.trim()) e.reason = 'Reason is required';
    if (!f.issue_date) e.issue_date = 'Issue date is required';
    return e;
}

const StatusBadge = ({ s }) => {
    const m = {
        pending: { bg: '#fef9c3', col: '#a16207', t: 'Pending' },
        issued: { bg: '#dcfce7', col: '#15803d', t: 'Issued' },
    };
    const c = m[s] || { bg: '#f1f5f9', col: '#475569', t: s };
    return <span style={{ background: c.bg, color: c.col, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{c.t}</span>;
};

export default function TransferCertificate() {
    const [all, setAll] = useState(INIT_DATA);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusF, setStatusF] = useState('');
    const [page, setPage] = useState(1);
    const [addOpen, setAddOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [errs, setErrs] = useState({});
    const [saving, setSaving] = useState(false);
    const [updatingId, setUpdating] = useState(null);

    useEffect(() => { const t = setTimeout(() => setLoading(false), 850); return () => clearTimeout(t); }, []);

    const filtered = all.filter(r => {
        const ms = !search || String(r.student_id).includes(search) || r.reason.toLowerCase().includes(search.toLowerCase()) || r.tc_number.toLowerCase().includes(search.toLowerCase());
        const mst = !statusF || r.status === statusF;
        return ms && mst;
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const field = k => ({ value: form[k], onChange: e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrs(p => ({ ...p, [k]: '' })); } });

    const handleSubmit = async e => {
        e.preventDefault();
        const errors = validate(form);
        if (Object.keys(errors).length) { setErrs(errors); return; }
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        const tcNo = mkTcNo();
        const newRow = {
            tc_id: NEXT_ID++,
            student_id: Number(form.student_id),
            institution_id: INSTITUTION_ID,
            tc_number: tcNo,
            issued_by: form.issued_by ? Number(form.issued_by) : null,
            issue_date: form.issue_date,
            reason: form.reason,
            status: 'pending',
        };
        setAll(prev => [newRow, ...prev]);
        toast.success(`Transfer Certificate ${tcNo} generated!`, { icon: '📄' });
        setAddOpen(false); setForm(emptyForm); setErrs({}); setPage(1);
        setSaving(false);
    };

    const handleMarkIssued = async (row) => {
        if (row.status !== 'pending') return;
        setUpdating(row.tc_id);
        await new Promise(r => setTimeout(r, 600));
        setAll(prev => prev.map(r => r.tc_id === row.tc_id ? { ...r, status: 'issued' } : r));
        toast.success(`TC ${row.tc_number} marked as issued!`);
        setUpdating(null);
    };

    const pendingCount = all.filter(r => r.status === 'pending').length;
    const issuedCount = all.filter(r => r.status === 'issued').length;

    const columns = [
        { key: 'tc_number', label: 'TC Number', render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#7c3aed', fontSize: '12px' }}>{r.tc_number}</span> },
        { key: 'student_id', label: 'Student ID', render: r => <span style={{ fontWeight: 500 }}>STU-{String(r.student_id).padStart(3, '0')}</span> },
        { key: 'reason', label: 'Reason', render: r => <span style={{ color: '#475569', maxWidth: '220px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</span> },
        { key: 'issue_date', label: 'Issue Date', render: r => new Date(r.issue_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
        { key: 'issued_by', label: 'Issued By', render: r => r.issued_by ? `Staff #${r.issued_by}` : '—' },
        { key: 'status', label: 'Status', render: r => <StatusBadge s={r.status} /> },
        {
            key: 'actions', label: 'Actions',
            render: r => (
                <AppButton
                    variant={r.status === 'pending' ? 'success' : 'secondary'}
                    icon={CheckCircle}
                    loading={updatingId === r.tc_id}
                    disabled={r.status !== 'pending'}
                    onClick={() => handleMarkIssued(r)}
                    style={{ padding: '6px 12px', fontSize: '12.5px', opacity: r.status !== 'pending' ? 0.5 : 1 }}
                >
                    {r.status === 'pending' ? 'Mark Issued' : 'Issued ✓'}
                </AppButton>
            ),
        },
    ];

    return (
        <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Transfer Certificate</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Generate and manage student transfer certificates · Institution #{INSTITUTION_ID}</p>
                </div>
                <AppButton icon={Plus} onClick={() => { setForm(emptyForm); setErrs({}); setAddOpen(true); }}>Generate TC</AppButton>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '14px' }}>
                {[
                    { label: 'Total TCs', value: all.length, color: '#2563eb', bg: '#eff6ff', icon: FileText },
                    { label: 'Pending', value: pendingCount, color: '#d97706', bg: '#fffbeb', icon: Clock },
                    { label: 'Issued', value: issuedCount, color: '#16a34a', bg: '#f0fdf4', icon: Shield },
                ].map(({ label, value, color, bg, icon: Icon }) => (
                    <div key={label} style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8edf5', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={17} color={color} /></div>
                        <div>
                            <p style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>{value}</p>
                            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '340px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search student ID, TC number, or reason..."
                        style={{ width: '100%', padding: '10px 14px 10px 32px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none', background: 'white' }}
                        onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <select value={statusF} onChange={e => { setStatusF(e.target.value); setPage(1); }}
                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none', background: 'white', cursor: 'pointer' }}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="issued">Issued</option>
                </select>
                {(search || statusF) && <AppButton variant="secondary" onClick={() => { setSearch(''); setStatusF(''); setPage(1); }} style={{ fontSize: '13px' }}>Clear</AppButton>}
                <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            <AppTable columns={columns} data={paged} loading={loading} emptyMessage="No transfer certificates issued yet." />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            {/* Generate TC Modal */}
            <AppModal isOpen={addOpen} onClose={() => { setAddOpen(false); setErrs({}); }} title="" size="md">
                <div>
                    {/* Attractive header */}
                    <div style={{
                        background: 'linear-gradient(135deg,#1e3a8a,#2563eb)',
                        borderRadius: '14px', padding: '24px 20px', textAlign: 'center', marginBottom: '24px',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1,
                            background: 'radial-gradient(circle at 30% 70%,white,transparent 50%)'
                        }} />
                        <FileText size={32} color="white" style={{ margin: '0 auto 8px', position: 'relative' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', position: 'relative' }}>Generate Transfer Certificate</h3>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', position: 'relative' }}>
                            A unique TC number will be auto-generated
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <AppInput label="Student ID" required placeholder="e.g. 101" error={errs.student_id} {...field('student_id')} />
                            <AppInput label="Issued By (Staff ID)" placeholder="e.g. 2 (optional)" {...field('issued_by')} />
                        </div>
                        <AppInput label="Issue Date" type="date" required error={errs.issue_date} {...field('issue_date')} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                                Reason <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                value={form.reason}
                                onChange={e => { setForm(p => ({ ...p, reason: e.target.value })); setErrs(p => ({ ...p, reason: '' })); }}
                                placeholder="State the reason for transfer..."
                                rows={4}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                                    border: `1.5px solid ${errs.reason ? '#fca5a5' : '#e2e8f0'}`,
                                    fontSize: '14px', resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                                onBlur={e => { e.target.style.borderColor = errs.reason ? '#fca5a5' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                            {errs.reason && <p style={{ fontSize: '12px', color: '#ef4444' }}>⚠ {errs.reason}</p>}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                            <AppButton variant="secondary" type="button" onClick={() => setAddOpen(false)}>Cancel</AppButton>
                            <AppButton type="submit" loading={saving} icon={FileText}>Generate TC</AppButton>
                        </div>
                    </form>
                </div>
            </AppModal>
        </div>
    );
}
