/**
 * AppTable - Premium reusable table
 * columns: [{ key, label, render?, width? }]
 */
export default function AppTable({ columns = [], data = [], loading = false, emptyMessage = 'No records found.' }) {
    return (
        <div style={{
            background: 'white', borderRadius: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04)',
            border: '1px solid #e8edf5', overflow: 'hidden',
        }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: 'linear-gradient(90deg, #eff6ff 0%, #f0f9ff 100%)' }}>
                            {columns.map((col) => (
                                <th key={col.key} style={{
                                    padding: '13px 18px', textAlign: 'left', fontWeight: 600,
                                    fontSize: '12px', color: '#1e40af', letterSpacing: '0.03em',
                                    borderBottom: '2px solid #dbeafe', whiteSpace: 'nowrap',
                                    width: col.width || 'auto',
                                }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    {columns.map((col) => (
                                        <td key={col.key} style={{ padding: '14px 18px' }}>
                                            <div className="shimmer" style={{ height: '14px', borderRadius: '6px', width: `${60 + Math.random() * 30}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '16px',
                                        background: '#eff6ff', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', margin: '0 auto 16px',
                                    }}>
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#93c5fd" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p style={{ color: '#64748b', fontWeight: 500, fontSize: '14px' }}>{emptyMessage}</p>
                                    <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Add a new record to get started</p>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr
                                    key={row.id || idx}
                                    style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} style={{ padding: '13px 18px', color: '#374151', verticalAlign: 'middle' }}>
                                            {col.render ? col.render(row) : (row[col.key] ?? '—')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
