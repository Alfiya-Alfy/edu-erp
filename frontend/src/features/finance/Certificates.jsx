import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Eye, Printer, Award, Shield, Star, CheckCircle2 } from 'lucide-react';
import AppTable from '../../components/shared/AppTable';
import AppModal from '../../components/shared/AppModal';
import AppInput from '../../components/shared/AppInput';
import AppButton from '../../components/shared/AppButton';
import AppSelect from '../../components/shared/AppSelect';
import Pagination from '../../components/shared/Pagination';

/* Schema: certification_id, student_id, institution_id, certificate_type (Bonafide|Course Completion),
   certificate_no UNIQUE, issued_by, issued_date, status (issued|cancelled) */

const INSTITUTION_ID = 1;
let NEXT_ID = 6;
let CERT_SEQ = 6;
const mkNo = () => `CERT-${new Date().getFullYear()}-${String(CERT_SEQ++).padStart(4, '0')}`;

const INIT_DATA = [
    { certification_id: 1, student_id: 101, institution_id: INSTITUTION_ID, certificate_type: 'Course Completion', certificate_no: 'CERT-2026-0001', issued_by: 1, issued_date: '2026-04-01', status: 'issued' },
    { certification_id: 2, student_id: 103, institution_id: INSTITUTION_ID, certificate_type: 'Bonafide', certificate_no: 'CERT-2026-0002', issued_by: 2, issued_date: '2026-03-28', status: 'issued' },
    { certification_id: 3, student_id: 105, institution_id: INSTITUTION_ID, certificate_type: 'Course Completion', certificate_no: 'CERT-2026-0003', issued_by: 1, issued_date: '2026-03-20', status: 'issued' },
    { certification_id: 4, student_id: 107, institution_id: INSTITUTION_ID, certificate_type: 'Bonafide', certificate_no: 'CERT-2026-0004', issued_by: 3, issued_date: '2026-03-15', status: 'cancelled' },
    { certification_id: 5, student_id: 102, institution_id: INSTITUTION_ID, certificate_type: 'Course Completion', certificate_no: 'CERT-2026-0005', issued_by: 2, issued_date: '2026-03-10', status: 'issued' },
];

const CERT_TYPES = [{ value: 'Bonafide', label: 'Bonafide Certificate' }, { value: 'Course Completion', label: 'Course Completion Certificate' }];
const PAGE_SIZE = 5;
const emptyForm = { student_id: '', certificate_type: 'Bonafide', issued_by: '', issued_date: '' };

function validate(f) {
    const e = {};
    if (!String(f.student_id).trim()) e.student_id = 'Student ID is required';
    if (!f.issued_date) e.issued_date = 'Issue date is required';
    return e;
}

const StatusBadge = ({ s }) => {
    const m = { issued: { bg: '#dcfce7', col: '#15803d', t: 'Issued' }, cancelled: { bg: '#fee2e2', col: '#b91c1c', t: 'Cancelled' } };
    const c = m[s] || { bg: '#f1f5f9', col: '#475569', t: s };
    return <span style={{ background: c.bg, color: c.col, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{c.t}</span>;
};

const TypeBadge = ({ t }) => {
    const isCC = t === 'Course Completion';
    return (
        <span style={{
            background: isCC ? 'linear-gradient(135deg,#eff6ff,#dbeafe)' : 'linear-gradient(135deg,#f5f3ff,#ede9fe)',
            color: isCC ? '#1d4ed8' : '#7c3aed',
            padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            border: `1px solid ${isCC ? '#bfdbfe' : '#c4b5fd'}`,
        }}>
            {isCC ? '🎓' : '📋'} {t}
        </span>
    );
};

/* ── Step indicator for the generate modal ──────────────── */
const StepIndicator = ({ step, total }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '20px' }}>
        {Array.from({ length: total }, (_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: i < step ? 'linear-gradient(135deg,#2563eb,#3b82f6)' : i === step ? '#dbeafe' : '#f1f5f9',
                    color: i < step ? 'white' : i === step ? '#1d4ed8' : '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                    border: i === step ? '2px solid #3b82f6' : 'none',
                    boxShadow: i < step ? '0 2px 6px rgba(37,99,235,0.3)' : 'none',
                }}>
                    {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                {i < total - 1 && <div style={{ width: '24px', height: '2px', background: i < step ? '#3b82f6' : '#e2e8f0', borderRadius: '2px' }} />}
            </div>
        ))}
    </div>
);

export default function Certificates() {
    const [all, setAll] = useState(INIT_DATA);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeF, setTypeF] = useState('');
    const [page, setPage] = useState(1);
    const [addOpen, setAddOpen] = useState(false);
    const [step, setStep] = useState(0); // 0: type select, 1: details, 2: confirm
    const [viewData, setViewData] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errs, setErrs] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => { const t = setTimeout(() => setLoading(false), 750); return () => clearTimeout(t); }, []);

    const filtered = all.filter(r => {
        const ms = !search || String(r.student_id).includes(search) || r.certificate_no.toLowerCase().includes(search.toLowerCase());
        const mt = !typeF || r.certificate_type === typeF;
        return ms && mt;
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const field = k => ({ value: form[k], onChange: e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrs(p => ({ ...p, [k]: '' })); } });

    const openGenerate = () => { setForm(emptyForm); setErrs({}); setStep(0); setAddOpen(true); };

    const handleNext = () => {
        if (step === 1) {
            const errors = validate(form);
            if (Object.keys(errors).length) { setErrs(errors); return; }
        }
        setStep(s => s + 1);
    };

    const handleSubmit = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        const certNo = mkNo();
        const newRow = {
            certification_id: NEXT_ID++,
            student_id: Number(form.student_id),
            institution_id: INSTITUTION_ID,
            certificate_type: form.certificate_type,
            certificate_no: certNo,
            issued_by: form.issued_by ? Number(form.issued_by) : null,
            issued_date: form.issued_date,
            status: 'issued',
        };
        setAll(prev => [newRow, ...prev]);
        toast.success(`Certificate ${certNo} generated successfully!`, { duration: 4000, icon: '🎉' });
        setAddOpen(false); setForm(emptyForm); setErrs({}); setStep(0); setPage(1);
        setSaving(false);
    };

    const handlePrint = () => window.print();

    const columns = [
        { key: 'certificate_no', label: 'Certificate No', render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#7c3aed', fontSize: '12px' }}>{r.certificate_no}</span> },
        { key: 'student_id', label: 'Student ID', render: r => <span style={{ fontWeight: 500 }}>STU-{String(r.student_id).padStart(3, '0')}</span> },
        { key: 'certificate_type', label: 'Type', render: r => <TypeBadge t={r.certificate_type} /> },
        { key: 'issued_date', label: 'Issue Date', render: r => new Date(r.issued_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
        { key: 'issued_by', label: 'Issued By', render: r => r.issued_by ? `Staff #${r.issued_by}` : '—' },
        { key: 'status', label: 'Status', render: r => <StatusBadge s={r.status} /> },
        { key: 'actions', label: 'Actions', render: r => <AppButton variant="outline" icon={Eye} onClick={() => setViewData(r)} style={{ padding: '6px 14px', fontSize: '12.5px' }}>View</AppButton> },
    ];

    /* ── Certificate type selection cards ──────────────── */
    const TypeCard = ({ type, selected, onClick }) => {
        const isCC = type === 'Course Completion';
        const active = selected === type;
        return (
            <div onClick={onClick} style={{
                flex: 1, minWidth: '180px', padding: '24px 20px', borderRadius: '16px', cursor: 'pointer',
                background: active ? (isCC ? 'linear-gradient(135deg,#1d4ed8,#3b82f6)' : 'linear-gradient(135deg,#7c3aed,#a78bfa)') : 'white',
                border: active ? 'none' : '2px solid #e2e8f0',
                boxShadow: active ? `0 8px 30px ${isCC ? 'rgba(29,78,216,0.35)' : 'rgba(124,58,237,0.35)'}` : '0 1px 4px rgba(0,0,0,0.06)',
                textAlign: 'center', transition: 'all 0.25s ease', transform: active ? 'scale(1.02)' : 'scale(1)',
            }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: active ? 'rgba(255,255,255,0.2)' : (isCC ? '#eff6ff' : '#f5f3ff'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px', fontSize: '24px',
                }}>
                    {isCC ? '🎓' : '📋'}
                </div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: active ? 'white' : '#0f172a', marginBottom: '6px' }}>{type}</p>
                <p style={{ fontSize: '12px', color: active ? 'rgba(255,255,255,0.8)' : '#94a3b8', lineHeight: 1.4 }}>
                    {isCC ? 'Awarded upon successful course completion' : 'Certifies student enrollment status'}
                </p>
                {active && (
                    <div style={{ marginTop: '12px' }}>
                        <CheckCircle2 size={20} color="white" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Certificates</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Generate and manage student certificates · Institution #{INSTITUTION_ID}</p>
                </div>
                <AppButton icon={Plus} onClick={openGenerate}>Generate Certificate</AppButton>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '14px' }}>
                {[
                    { label: 'Total Issued', value: all.filter(r => r.status === 'issued').length, color: '#16a34a', bg: '#f0fdf4', icon: Award },
                    { label: 'Cancelled', value: all.filter(r => r.status === 'cancelled').length, color: '#dc2626', bg: '#fff1f2', icon: Shield },
                    { label: 'Bonafide', value: all.filter(r => r.certificate_type === 'Bonafide').length, color: '#2563eb', bg: '#eff6ff', icon: Star },
                    { label: 'Course Completion', value: all.filter(r => r.certificate_type === 'Course Completion').length, color: '#7c3aed', bg: '#f5f3ff', icon: Award },
                ].map(({ label, value, color, bg, icon: Icon }) => (
                    <div key={label} style={{ background: 'white', borderRadius: '14px', padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8edf5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={16} color={color} /></div>
                        <div>
                            <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{value}</p>
                            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '300px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search student ID or cert no..."
                        style={{ width: '100%', padding: '10px 14px 10px 32px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none', background: 'white' }}
                        onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <select value={typeF} onChange={e => { setTypeF(e.target.value); setPage(1); }}
                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13.5px', outline: 'none', background: 'white', cursor: 'pointer' }}>
                    <option value="">All Types</option>
                    {CERT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {(search || typeF) && <AppButton variant="secondary" onClick={() => { setSearch(''); setTypeF(''); setPage(1); }} style={{ fontSize: '13px' }}>Clear</AppButton>}
                <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            <AppTable columns={columns} data={paged} loading={loading} emptyMessage="No certificates issued yet." />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            {/* ══════════════ Generate Certificate - Multi-step Modal ══════════════ */}
            <AppModal isOpen={addOpen} onClose={() => { setAddOpen(false); setStep(0); setErrs({}); }} title="" size="lg">
                <div>
                    {/* Custom header with gradient */}
                    <div style={{
                        background: 'linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed)',
                        borderRadius: '14px', padding: '28px 24px', textAlign: 'center', marginBottom: '24px',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1,
                            background: 'radial-gradient(circle at 20% 80%,white,transparent 50%),radial-gradient(circle at 80% 20%,white,transparent 50%)'
                        }} />
                        <Award size={36} color="white" style={{ margin: '0 auto 10px', position: 'relative' }} />
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'white', position: 'relative' }}>Generate Certificate</h3>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '6px', position: 'relative' }}>
                            Fill in the details to create a new certificate
                        </p>
                    </div>

                    <StepIndicator step={step} total={3} />

                    {/* Step 0: Choose type */}
                    {step === 0 && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Select Certificate Type</p>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Choose the type of certificate to generate</p>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <TypeCard type="Bonafide" selected={form.certificate_type} onClick={() => setForm(p => ({ ...p, certificate_type: 'Bonafide' }))} />
                                <TypeCard type="Course Completion" selected={form.certificate_type} onClick={() => setForm(p => ({ ...p, certificate_type: 'Course Completion' }))} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <AppButton onClick={handleNext}>Continue →</AppButton>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Student details */}
                    {step === 1 && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Student & Issuer Details</p>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Provide the student and issuing authority information</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <AppInput label="Student ID" required placeholder="e.g. 101" error={errs.student_id} {...field('student_id')} />
                                    <AppInput label="Issued By (Staff ID)" placeholder="e.g. 2 (optional)" {...field('issued_by')} />
                                </div>
                                <AppInput label="Issue Date" type="date" required error={errs.issued_date} {...field('issued_date')} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                                <AppButton variant="secondary" onClick={() => setStep(0)}>← Back</AppButton>
                                <AppButton onClick={handleNext}>Continue →</AppButton>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Review & Confirm */}
                    {step === 2 && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Review & Generate</p>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Confirm the details below before generating</p>

                            {/* Preview card */}
                            <div style={{
                                border: '2px solid #c7d2fe', borderRadius: '16px', padding: '28px 24px', textAlign: 'center',
                                background: 'linear-gradient(135deg,#f8faff,#eff6ff,#f5f3ff)',
                                position: 'relative', overflow: 'hidden', marginBottom: '20px',
                            }}>
                                {/* Decorative corners */}
                                <div style={{ position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', borderTop: '2px solid #a5b4fc', borderLeft: '2px solid #a5b4fc', borderRadius: '4px 0 0 0' }} />
                                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderTop: '2px solid #a5b4fc', borderRight: '2px solid #a5b4fc', borderRadius: '0 4px 0 0' }} />
                                <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '20px', height: '20px', borderBottom: '2px solid #a5b4fc', borderLeft: '2px solid #a5b4fc', borderRadius: '0 0 0 4px' }} />
                                <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '20px', height: '20px', borderBottom: '2px solid #a5b4fc', borderRight: '2px solid #a5b4fc', borderRadius: '0 0 4px 0' }} />

                                {/* Watermark */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03,
                                    background: 'repeating-linear-gradient(45deg,#4f46e5,#4f46e5 1px,transparent 1px,transparent 16px)'
                                }} />

                                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{form.certificate_type === 'Course Completion' ? '🎓' : '📋'}</div>
                                <p style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>EduERP Institute · Institution #{INSTITUTION_ID}</p>
                                <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg,#3b82f6,#7c3aed)', margin: '12px auto', borderRadius: '2px' }} />
                                <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Certificate of</p>
                                <p style={{
                                    fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0',
                                    background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                }}>{form.certificate_type}</p>
                                <p style={{ fontSize: '13px', color: '#475569', margin: '14px 0 4px' }}>This is to certify that the student</p>
                                <p style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>STU-{String(form.student_id || '000').padStart(3, '0')}</p>
                                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
                                    {form.issued_date ? `Issued on ${new Date(form.issued_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Date pending'}
                                </p>
                                {form.issued_by && (
                                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Authorized by: Staff #{form.issued_by}</p>
                                )}
                                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                                    <p style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Ready to issue</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                <AppButton variant="secondary" onClick={() => setStep(1)}>← Back</AppButton>
                                <AppButton loading={saving} onClick={handleSubmit} icon={Award}>
                                    🎉 Generate Certificate
                                </AppButton>
                            </div>
                        </div>
                    )}
                </div>
            </AppModal>

            {/* ══════════════ View / Print Modal ══════════════ */}
            <AppModal isOpen={!!viewData} onClose={() => setViewData(null)} title="Certificate Preview" size="md">
                {viewData && (
                    <div>
                        <div style={{
                            border: '2px solid #c7d2fe', borderRadius: '16px', padding: '36px 28px', textAlign: 'center',
                            background: 'linear-gradient(135deg,#f8faff,#eff6ff,#f5f3ff)',
                            position: 'relative', overflow: 'hidden', marginBottom: '20px',
                        }}>
                            {/* Decorative corners */}
                            <div style={{ position: 'absolute', top: '8px', left: '8px', width: '24px', height: '24px', borderTop: '2px solid #a5b4fc', borderLeft: '2px solid #a5b4fc', borderRadius: '4px 0 0 0' }} />
                            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderTop: '2px solid #a5b4fc', borderRight: '2px solid #a5b4fc', borderRadius: '0 4px 0 0' }} />
                            <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '24px', height: '24px', borderBottom: '2px solid #a5b4fc', borderLeft: '2px solid #a5b4fc', borderRadius: '0 0 0 4px' }} />
                            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '24px', height: '24px', borderBottom: '2px solid #a5b4fc', borderRight: '2px solid #a5b4fc', borderRadius: '0 0 4px 0' }} />

                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03,
                                background: 'repeating-linear-gradient(45deg,#4f46e5,#4f46e5 1px,transparent 1px,transparent 16px)'
                            }} />

                            <div style={{ fontSize: '36px', marginBottom: '10px' }}>{viewData.certificate_type === 'Course Completion' ? '🎓' : '📋'}</div>
                            <p style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>EduERP Institute</p>
                            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg,#3b82f6,#7c3aed)', margin: '12px auto', borderRadius: '2px' }} />
                            <p style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>Certificate of</p>
                            <p style={{
                                fontSize: '24px', fontWeight: 700, marginBottom: '18px',
                                background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>{viewData.certificate_type}</p>
                            <p style={{ fontSize: '13px', color: '#374151' }}>This is to certify that student</p>
                            <p style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>STU-{String(viewData.student_id).padStart(3, '0')}</p>
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '16px' }}>
                                Issued on: {new Date(viewData.issued_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #e0e7ff' }}>
                                <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>{viewData.certificate_no}</p>
                                <StatusBadge s={viewData.status} />
                            </div>
                        </div>
                        <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <AppButton variant="outline" icon={Eye} onClick={() => navigator.clipboard?.writeText(viewData.certificate_no).then(() => toast.success('Cert No copied!'))}>Copy No</AppButton>
                            <AppButton icon={Printer} onClick={handlePrint}>Print Certificate</AppButton>
                        </div>
                    </div>
                )}
            </AppModal>
        </div>
    );
}
