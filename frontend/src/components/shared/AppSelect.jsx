export default function AppSelect({ label, value, onChange, options = [], error = '', required = false, placeholder = 'Select...' }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {label && (
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    {label}{required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
                    border: `1.5px solid ${error ? '#fca5a5' : '#e2e8f0'}`,
                    background: 'white', color: value ? '#1e293b' : '#94a3b8',
                    outline: 'none', cursor: 'pointer', appearance: 'auto',
                }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = error ? '#fca5a5' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            >
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {error && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '2px' }}>⚠ {error}</p>}
        </div>
    );
}
