const STYLES = {
    primary: { background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', boxShadow: '0 2px 8px rgba(59,130,246,0.35)' },
    secondary: { background: '#f1f5f9', color: '#475569', border: '1.5px solid #e2e8f0', boxShadow: 'none' },
    danger: { background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: 'white', border: 'none', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' },
    outline: { background: 'white', color: '#2563eb', border: '1.5px solid #bfdbfe', boxShadow: 'none' },
    success: { background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', border: 'none', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' },
};

const HOVER = {
    primary: { background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' },
    secondary: { background: '#e2e8f0' },
    danger: { background: 'linear-gradient(135deg, #b91c1c, #dc2626)' },
    outline: { background: '#eff6ff', borderColor: '#93c5fd' },
    success: { background: 'linear-gradient(135deg, #15803d, #16a34a)' },
};

export default function AppButton({ children, onClick, type = 'button', variant = 'primary', loading = false, disabled = false, className = '', icon: Icon, style: extraStyle = {} }) {
    const base = STYLES[variant] || STYLES.primary;
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 600,
                cursor: disabled || loading ? 'not-allowed' : 'pointer',
                opacity: disabled || loading ? 0.6 : 1,
                whiteSpace: 'nowrap', transition: 'all 0.18s ease',
                ...base, ...extraStyle,
            }}
            onMouseEnter={e => { if (!disabled && !loading) Object.assign(e.currentTarget.style, HOVER[variant]); }}
            onMouseLeave={e => { if (!disabled && !loading) Object.assign(e.currentTarget.style, base); }}
        >
            {loading ? (
                <svg style={{ animation: 'spin 0.8s linear infinite' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
            ) : Icon && <Icon size={15} />}
            {children}
        </button>
    );
}
