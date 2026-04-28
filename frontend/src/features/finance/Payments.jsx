import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Eye, CreditCard, TrendingUp, Clock, XCircle } from 'lucide-react';
import AppTable from '../../components/shared/AppTable';
import AppModal from '../../components/shared/AppModal';
import AppInput from '../../components/shared/AppInput';
import AppButton from '../../components/shared/AppButton';
import AppSelect from '../../components/shared/AppSelect';
import Pagination from '../../components/shared/Pagination';

/* ─── Schema-aligned mock data ────────────────────────────── */
const INSTITUTION_ID = 1;
let NEXT_ID = 9;
const INIT_DATA = [
    { payment_id: 1, student_id: 101, institution_id: INSTITUTION_ID, received_by: 1, amount: 12000, payment_method: 'UPI', transaction_id: 'TXN-001', payment_date: '2026-04-01', status: 'success' },
    { payment_id: 2, student_id: 102, institution_id: INSTITUTION_ID, received_by: 2, amount: 8500, payment_method: 'Cash', transaction_id: '', payment_date: '2026-03-28', status: 'success' },
    { payment_id: 3, student_id: 103, institution_id: INSTITUTION_ID, received_by: 1, amount: 6000, payment_method: 'Bank', transaction_id: 'TXN-003', payment_date: '2026-03-25', status: 'pending' },
    { payment_id: 4, student_id: 104, institution_id: INSTITUTION_ID, received_by: 3, amount: 15000, payment_method: 'UPI', transaction_id: 'TXN-004', payment_date: '2026-03-22', status: 'success' },
    { payment_id: 5, student_id: 105, institution_id: INSTITUTION_ID, received_by: 2, amount: 4500, payment_method: 'Bank', transaction_id: 'TXN-005', payment_date: '2026-03-20', status: 'failed' },
    { payment_id: 6, student_id: 106, institution_id: INSTITUTION_ID, received_by: 1, amount: 9000, payment_method: 'Cash', transaction_id: '', payment_date: '2026-03-18', status: 'success' },
    { payment_id: 7, student_id: 107, institution_id: INSTITUTION_ID, received_by: 2, amount: 11000, payment_method: 'UPI', transaction_id: 'TXN-007', payment_date: '2026-03-15', status: 'pending' },
    { payment_id: 8, student_id: 108, institution_id: INSTITUTION_ID, received_by: 3, amount: 7500, payment_method: 'Bank', transaction_id: 'TXN-008', payment_date: '2026-03-10', status: 'success' },
];

const METHOD_OPTS = [{ value: 'Cash', label: 'Cash' }, { value: 'UPI', label: 'UPI' }, { value: 'Bank', label: 'Bank Transfer' }];
const STATUS_OPTS = [{ value: 'success', label: 'Success' }, { value: 'pending', label: 'Pending' }, { value: 'failed', label: 'Failed' }];
const PAGE_SIZE = 5;
const emptyForm = { student_id: '', received_by: '', amount: '', payment_method: 'Cash', transaction_id: '', payment_date: '', status: 'pending' };

function validate(f) {
    const e = {};
    if (!String(f.student_id).trim()) e.student_id = 'Student ID is required';
    if (!f.amount || isNaN(f.amount) || Number(f.amount) <= 0) e.amount = 'Enter a valid positive amount';
    if (!f.payment_date) e.payment_date = 'Payment date is required';
    return e;
}

const StatusBadge = ({ s }) => {
    const m = { success: { bg: '#dcfce7', col: '#15803d', t: 'Success' }, pending: { bg: '#fef9c3', col: '#a16207', t: 'Pending' }, failed: { bg: '#fee2e2', col: '#b91c1c', t: 'Failed' } };
    const c = m[s] || { bg: '#f1f5f9', col: '#475569', t: s };
    return <span style={{ background: c.bg, color: c.col, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{c.t}</span>;
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div style={{ background: 'white', borderRadius: '14px', padding: '18px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8edf5', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={20} color={color} /></div>
        <div>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{label}</p>
        </div>
    </div>
);

export default function Payments() {
    const [all, setAll] = useState(INIT_DATA);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusF, setStatusF] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);
    const [addOpen, setAddOpen] = useState(false);
    const [viewRow, setViewRow] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errs, setErrs] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);

    const filtered = all.filter(r => {
        const matchS = !search || String(r.student_id).includes(search) || (r.transaction_id || '').toLowerCase().includes(search.toLowerCase());
        const matchSt = !statusF || r.status === statusF;
        const matchDf = !dateFrom || r.payment_date >= dateFrom;
        const matchDt = !dateTo || r.payment_date <= dateTo;
        return matchS && matchSt && matchDf && matchDt;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const totalCollected = all.filter(r => r.status === 'success').reduce((s, r) => s + Number(r.amount), 0);

    const field = (key) => ({
        value: form[key],
        onChange: e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrs(p => ({ ...p, [key]: '' })); },
    });

    const handleSubmit = async e => {
        e.preventDefault();
        const errors = validate(form);
        if (Object.keys(errors).length) { setErrs(errors); return; }
        setSaving(true);
        await new Promise(r => setTimeout(r, 700));
        const newRow = { ...form, payment_id: NEXT_ID++, institution_id: INSTITUTION_ID, amount: Number(form.amount), student_id: Number(form.student_id) };
        setAll(prev => [newRow, ...prev]);
        toast.success('Payment recorded successfully!');
        setAddOpen(false); setForm(emptyForm); setErrs({}); setPage(1);
        setSaving(false);
    };

    const columns = [
        { key: 'payment_id', label: 'Receipt No', render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>#PAY-{String(r.payment_id).padStart(4, '0')}</span> },
        { key: 'student_id', label: 'Student ID', render: r => <span style={{ fontWeight: 500 }}>STU-{String(r.student_id).padStart(3, '0')}</span> },
        { key: 'amount', label: 'Amount', render: r => <span style={{ fontWeight: 700, color: '#15803d' }}>₹{Number(r.amount).toLocaleString('en-IN')}</span> },
        { key: 'payment_method', label: 'Method' },
        { key: 'transaction_id', label: 'Txn ID', render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>{r.transaction_id || '—'}</span> },
        { key: 'payment_date', label: 'Date', render: r => new Date(r.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
        { key: 'status', label: 'Status', render: r => <StatusBadge s={r.status} /> },
        {
            key: 'actions', label: 'Actions',
            render: r => <AppButton variant="outline" icon={Eye} onClick={() => setViewRow(r)} style={{ padding: '6px 14px', fontSize: '12.5px' }}>View</AppButton>,
        },
    ];

    const clearFilters = () => { setSearch(''); setStatusF(''); setDateFrom(''); setDateTo(''); setPage(1); };
    const hasFilters = search || statusF || dateFrom || dateTo;

    return (
        <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Payments</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Track and manage all financial transactions · Institution #{INSTITUTION_ID}</p>
                </div>
                <AppButton icon={Plus} onClick={() => { setForm(emptyForm); setErrs({}); setAddOpen(true); }}>Add Payment</AppButton>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '14px' }}>
                <StatCard icon={CreditCard} label="Total Collected" value={`₹${(totalCollected / 1000).toFixed(1)}k`} color="#2563eb" bg="#eff6ff" />
                <StatCard icon={TrendingUp} label="Total Payments" value={all.length} color="#16a34a" bg="#f0fdf4" />
                <StatCard icon={Clock} label="Pending" value={all.filter(r => r.status === 'pending').length} color="#d97706" bg="#fffbeb" />
                <StatCard icon={XCircle} label="Failed" value={all.filter(r => r.status === 'failed').length} color="#dc2626" bg="#fff1f2" />
            </div>

            {/* Filters */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8edf5', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: '1', minWidth: '180px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Search</label>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Student ID or Txn ID..."
                            style={{ width: '100%', padding: '9px 14px 9px 32px', borderRadius: '9px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none' }}
                            onFocus={e => { e.target.style.borderColor = '#3b82f6'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                    </div>
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Status</label>
                    <select value={statusF} onChange={e => { setStatusF(e.target.value); setPage(1); }}
                        style={{ padding: '9px 12px', borderRadius: '9px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none', background: 'white', cursor: 'pointer' }}>
                        <option value="">All Statuses</option>
                        {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>From</label>
                    <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                        style={{ padding: '9px 12px', borderRadius: '9px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#3b82f6'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>To</label>
                    <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
                        style={{ padding: '9px 12px', borderRadius: '9px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#3b82f6'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                </div>
                {hasFilters && <AppButton variant="secondary" onClick={clearFilters} style={{ fontSize: '13px' }}>Clear</AppButton>}
                <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            <AppTable columns={columns} data={paged} loading={loading} emptyMessage="No payments match your filters." />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            {/* Add Payment Modal */}
            <AppModal isOpen={addOpen} onClose={() => { setAddOpen(false); setErrs({}); }} title="Record New Payment" size="lg">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <AppInput label="Student ID" required placeholder="e.g. 101" error={errs.student_id} {...field('student_id')} />
                        <AppInput label="Received By (Staff ID)" placeholder="e.g. 2" {...field('received_by')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <AppInput label="Amount (₹)" type="number" required placeholder="e.g. 5000" error={errs.amount} {...field('amount')} />
                        <AppSelect label="Payment Method" options={METHOD_OPTS} required {...field('payment_method')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <AppInput label="Transaction ID" placeholder="UPI / Bank ref (optional)" {...field('transaction_id')} />
                        <AppInput label="Payment Date" type="date" required error={errs.payment_date} {...field('payment_date')} />
                    </div>
                    <AppSelect label="Status" options={STATUS_OPTS} {...field('status')} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                        <AppButton variant="secondary" type="button" onClick={() => setAddOpen(false)}>Cancel</AppButton>
                        <AppButton type="submit" loading={saving}>Save Payment</AppButton>
                    </div>
                </form>
            </AppModal>

            {/* View Modal */}
            <AppModal isOpen={!!viewRow} onClose={() => setViewRow(null)} title="Payment Details" size="sm">
                {viewRow && (
                    <div>
                        <div style={{ textAlign: 'center', padding: '12px 0 20px', borderBottom: '1px solid #f1f5f9', marginBottom: '18px' }}>
                            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#dbeafe,#eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                                <CreditCard size={22} color="#2563eb" />
                            </div>
                            <p style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>#PAY-{String(viewRow.payment_id).padStart(4, '0')}</p>
                            <div style={{ marginTop: '8px' }}><StatusBadge s={viewRow.status} /></div>
                        </div>
                        {[
                            ['Student ID', `STU-${String(viewRow.student_id).padStart(3, '0')}`],
                            ['Amount', `₹${Number(viewRow.amount).toLocaleString('en-IN')}`],
                            ['Method', viewRow.payment_method],
                            ['Transaction ID', viewRow.transaction_id || '—'],
                            ['Date', new Date(viewRow.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
                            ['Received By', viewRow.received_by ? `Staff #${viewRow.received_by}` : '—'],
                        ].map(([label, value]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f8fafc', fontSize: '14px' }}>
                                <span style={{ color: '#64748b', fontWeight: 500 }}>{label}</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </AppModal>
        </div>
    );
}
