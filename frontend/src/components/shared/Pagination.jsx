import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);

    const btnBase = { border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', fontSize: '13px', fontWeight: 500 };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Page <strong style={{ color: '#1e293b' }}>{currentPage}</strong> of <strong style={{ color: '#1e293b' }}>{totalPages}</strong>
            </p>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} style={{ ...btnBase, width: '34px', height: '34px', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                    <ChevronLeft size={16} color="#64748b" />
                </button>
                {pages.map(p => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        style={{
                            ...btnBase, width: '34px', height: '34px', color: p === currentPage ? 'white' : '#374151',
                            background: p === currentPage ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'white',
                            border: p === currentPage ? 'none' : '1.5px solid #e2e8f0',
                            boxShadow: p === currentPage ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
                        }}
                    >{p}</button>
                ))}
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ ...btnBase, width: '34px', height: '34px', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
                    <ChevronRight size={16} color="#64748b" />
                </button>
            </div>
        </div>
    );
}
