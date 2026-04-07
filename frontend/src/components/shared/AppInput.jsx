export default function AppInput({ label, type = 'text', value, onChange, placeholder = '', error = '', required = false, ...rest }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {label && (
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    {label}{required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '10px', fontSize: '14px',
                    border: `1.5px solid ${error ? '#fca5a5' : '#e2e8f0'}`,
                    background: error ? '#fff5f5' : 'white',
                    color: '#1e293b', outline: 'none',
                    boxShadow: error ? '0 0 0 3px rgba(252,165,165,0.2)' : 'none',
                }}
                onFocus={e => {
                    if (!error) {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
                    }
                }}
                onBlur={e => {
                    if (!error) {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                    }
                }}
                {...rest}
            />
            {error && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '2px' }}>⚠ {error}</p>}
        </div>
    );
}
