import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2, BookOpen } from 'lucide-react';
import AppTable from '../../components/shared/AppTable';
import AppModal from '../../components/shared/AppModal';
import AppInput from '../../components/shared/AppInput';
import AppButton from '../../components/shared/AppButton';
import AppSelect from '../../components/shared/AppSelect';
import Pagination from '../../components/shared/Pagination';

/* Fee Structure – with institution_id */
const INSTITUTION_ID = 1;
let NEXT_ID = 8;
const INIT_DATA = [
    { id: 1, course_id: 'CSE-101', course_name: 'B.Sc Computer Science', institution_id: INSTITUTION_ID, fee_type: 'tuition', amount: 45000, due_date: '2026-05-01', academic_year: '2025-26' },
    { id: 2, course_id: 'CSE-101', course_name: 'B.Sc Computer Science', institution_id: INSTITUTION_ID, fee_type: 'exam', amount: 3500, due_date: '2026-05-15', academic_year: '2025-26' },
    { id: 3, course_id: 'BBA-201', course_name: 'Bachelor of Business', institution_id: INSTITUTION_ID, fee_type: 'tuition', amount: 38000, due_date: '2026-05-01', academic_year: '2025-26' },
    { id: 4, course_id: 'BBA-201', course_name: 'Bachelor of Business', institution_id: INSTITUTION_ID, fee_type: 'library', amount: 1200, due_date: '2026-06-01', academic_year: '2025-26' },
    { id: 5, course_id: 'MCA-301', course_name: 'Master of Comp Apps', institution_id: INSTITUTION_ID, fee_type: 'tuition', amount: 52000, due_date: '2026-05-01', academic_year: '2025-26' },
    { id: 6, course_id: 'MCA-301', course_name: 'Master of Comp Apps', institution_id: INSTITUTION_ID, fee_type: 'hostel', amount: 18000, due_date: '2026-04-15', academic_year: '2025-26' },
    { id: 7, course_id: 'ECE-401', course_name: 'B.Sc Electronics', institution_id: INSTITUTION_ID, fee_type: 'transport', amount: 8000, due_date: '2026-05-10', academic_year: '2025-26' },
];

const FEE_TYPES = [
    { value: 'tuition', label: 'Tuition Fee' },
    { value: 'exam', label: 'Exam Fee' },
    { value: 'library', label: 'Library Fee' },
    { value: 'hostel', label: 'Hostel Fee' },
    { value: 'transport', label: 'Transport Fee' },
    { value: 'other', label: 'Other' },
];
const PAGE_SIZE = 5;
const emptyForm = { course_id: '', course_name: '', fee_type: 'tuition', amount: '', due_date: '', academic_year: '' };

function validate(f) {
    const e = {};
    if (!f.course_id.trim()) e.course_id = 'Course ID is required';
    if (!f.course_name.trim()) e.course_name = 'Course name is required';
    if (!f.amount || isNaN(f.amount) || Number(f.amount) <= 0) e.amount = 'Enter a valid positive amount';
    if (!f.due_date) e.due_date = 'Due date is required';
    if (!f.academic_year.trim()) e.academic_year = 'Academic year is required (e.g. 2025-26)';
    return e;
}

const typeBadge = (type) => {
    const c = { tuition: ['#dbeafe', '#1d4ed8'], exam: ['#fef3c7', '#92400e'], library: ['#d1fae5', '#065f46'], hostel: ['#ede9fe', '#5b21b6'], transport: ['#fce7f3', '#9d174d'], other: ['#f1f5f9', '#475569'] };
    const [bg, col] = c[type] || ['#f1f5f9', '#475569'];
    const label = FEE_TYPES.find(t => t.value === type)?.label || type;
    return <span style={{ background: bg, color: col, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{label}</span>;
};

export default function FeeStructure() {
    const [all, setAll] = useState(INIT_DATA);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [courseFilter, setCourse] = useState('');
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errs, setErrs] = useState({});
    const [saving, setSaving] = useState(false);
    const [delTarget, setDelTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

    const courses = [...new Set(all.map(r => r.course_id))];
    const filtered = all.filter(r => {
        const ms = !search || r.course_id.toLowerCase().includes(search.toLowerCase()) || r.course_name.toLowerCase().includes(search.toLowerCase()) || r.academic_year.includes(search);
        const mc = !courseFilter || r.course_id === courseFilter;
        return ms && mc;
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const field = k => ({ value: form[k], onChange: e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrs(p => ({ ...p, [k]: '' })); } });

    const openAdd = () => { setEditId(null); setForm(emptyForm); setErrs({}); setModalOpen(true); };
    const openEdit = row => {
        setEditId(row.id);
        setForm({ course_id: row.course_id, course_name: row.course_name, fee_type: row.fee_type, amount: String(row.amount), due_date: row.due_date, academic_year: row.academic_year });
        setErrs({}); setModalOpen(true);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const errors = validate(form);
        if (Object.keys(errors).length) { setErrs(errors); return; }
        setSaving(true);
        await new Promise(r => setTimeout(r, 700));
        if (editId) {
            setAll(prev => prev.map(r => r.id === editId ? { ...r, ...form, amount: Number(form.amount) } : r));
            toast.success('Fee structure updated!');
        } else {
            setAll(prev => [{ ...form, id: NEXT_ID++, institution_id: INSTITUTION_ID, amount: Number(form.amount) }, ...prev]);
            toast.success('Fee structure added!');
        }
        setModalOpen(false); setSaving(false); setPage(1);
    };

    const handleDelete = async () => {
        setDeleting(true);
        await new Promise(r => setTimeout(r, 500));
        setAll(prev => prev.filter(r => r.id !== delTarget.id));
        toast.success('Fee structure deleted.');
        setDelTarget(null); setDeleting(false);
    };

    const totalFees = all.reduce((s, r) => s + Number(r.amount), 0);

    const columns = [
        { key: 'course_id', label: 'Course ID', render: r => <span style={{ fontWeight: 700, color: '#1e40af', fontFamily: 'monospace' }}>{r.course_id}</span> },
        { key: 'course_name', label: 'Course Name', render: r => <span style={{ fontWeight: 500, color: '#374151' }}>{r.course_name}</span> },
        { key: 'fee_type', label: 'Fee Type', render: r => typeBadge(r.fee_type) },
        { key: 'amount', label: 'Amount', render: r => <span style={{ fontWeight: 700, color: '#15803d' }}>₹{Number(r.amount).toLocaleString('en-IN')}</span> },
        { key: 'due_date', label: 'Due Date', render: r => new Date(r.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
        { key: 'academic_year', label: 'Acad. Year' },
        {
            key: 'actions', label: 'Actions',
            render: r => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <AppButton variant="outline" icon={Pencil} onClick={() => openEdit(r)} style={{ padding: '6px 12px', fontSize: '12.5px' }}>Edit</AppButton>
                    <AppButton variant="danger" icon={Trash2} onClick={() => setDelTarget(r)} style={{ padding: '6px 12px', fontSize: '12.5px' }}>Delete</AppButton>
                </div>
            ),
        },
    ];

    return (
        <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Fee Structure</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Define and manage course-wise fee configurations · Institution #{INSTITUTION_ID}</p>
                </div>
                <AppButton icon={Plus} onClick={openAdd}>Add Fee Structure</AppButton>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px' }}>
                {[
                    { label: 'Total Entries', value: all.length, color: '#2563eb', bg: '#eff6ff' },
                    { label: 'Total Fees Defined', value: `₹${(totalFees / 1000).toFixed(0)}k`, color: '#16a34a', bg: '#f0fdf4' },
                    { label: 'Courses Covered', value: [...new Set(all.map(r => r.course_id))].length, color: '#7c3aed', bg: '#f5f3ff' },
                    { label: 'Academic Year', value: all[0]?.academic_year || '—', color: '#d97706', bg: '#fffbeb' },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8edf5', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOpen size={18} color={color} /></div>
                        <div>
                            <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{value}</p>
                            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '300px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search course or year..."
                        style={{ width: '100%', padding: '10px 14px 10px 32px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none', background: 'white' }}
                        onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <select value={courseFilter} onChange={e => { setCourse(e.target.value); setPage(1); }}
                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none', background: 'white', cursor: 'pointer' }}>
                    <option value="">All Courses</option>
                    {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {(search || courseFilter) && <AppButton variant="secondary" onClick={() => { setSearch(''); setCourse(''); setPage(1); }} style={{ fontSize: '13px' }}>Clear</AppButton>}
                <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            <AppTable columns={columns} data={paged} loading={loading} emptyMessage="No fee structures defined." />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            {/* Add/Edit Modal */}
            <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Fee Structure' : 'Add Fee Structure'} size="md">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <AppInput label="Course ID" required placeholder="e.g. CSE-101" error={errs.course_id} {...field('course_id')} />
                        <AppInput label="Course Name" required placeholder="e.g. B.Sc Computer Science" error={errs.course_name} {...field('course_name')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <AppSelect label="Fee Type" options={FEE_TYPES} {...field('fee_type')} />
                        <AppInput label="Amount (₹)" type="number" required placeholder="e.g. 15000" error={errs.amount} {...field('amount')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <AppInput label="Due Date" type="date" required error={errs.due_date} {...field('due_date')} />
                        <AppInput label="Academic Year" required placeholder="e.g. 2025-26" error={errs.academic_year} {...field('academic_year')} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                        <AppButton variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</AppButton>
                        <AppButton type="submit" loading={saving}>{editId ? 'Update' : 'Save'}</AppButton>
                    </div>
                </form>
            </AppModal>

            {/* Delete Confirm */}
            <AppModal isOpen={!!delTarget} onClose={() => setDelTarget(null)} title="Confirm Delete" size="sm">
                {delTarget && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Trash2 size={22} color="#ef4444" /></div>
                            <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Delete this fee entry?</p>
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                                Removes <strong>{FEE_TYPES.find(t => t.value === delTarget.fee_type)?.label}</strong> for <strong>{delTarget.course_id}</strong>.
                            </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <AppButton variant="secondary" onClick={() => setDelTarget(null)}>Cancel</AppButton>
                            <AppButton variant="danger" loading={deleting} onClick={handleDelete}>Yes, Delete</AppButton>
                        </div>
                    </div>
                )}
            </AppModal>
        </div>
    );
}
