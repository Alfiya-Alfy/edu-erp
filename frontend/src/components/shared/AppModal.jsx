import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function AppModal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            document.addEventListener('keydown', h);
            document.body.style.overflow = 'hidden';
        }
        return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxW = { sm: '440px', md: '560px', lg: '720px' }[size] || '560px';

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px',
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(15,23,42,0.55)',
                    backdropFilter: 'blur(4px)',
                }}
            />
            {/* Dialog */}
            <div
                className="modal-enter"
                style={{
                    position: 'relative', background: 'white', borderRadius: '20px',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.22)',
                    width: '100%', maxWidth: maxW, maxHeight: '90vh',
                    display: 'flex', flexDirection: 'column',
                    border: '1px solid #e8edf5',
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
                }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                    >
                        <X size={16} />
                    </button>
                </div>
                {/* Body */}
                <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
