import { NavLink, useNavigate } from 'react-router-dom';
import { CreditCard, FileText, Award, BookOpen, LogOut, GraduationCap, LayoutDashboard } from 'lucide-react';

const navItems = [
    { label: 'Payments', path: '/finance/payments', icon: CreditCard },
    { label: 'Fee Structure', path: '/finance/fee-structure', icon: BookOpen },
    { label: 'Certificates', path: '/finance/certificates', icon: Award },
    { label: 'Transfer Certificate', path: '/finance/transfer-certificate', icon: FileText },
];

export default function Sidebar() {
    const navigate = useNavigate();
    return (
        <aside
            style={{
                position: 'fixed', top: 0, left: 0, height: '100vh', width: '240px', zIndex: 40,
                background: 'linear-gradient(180deg, #0f2057 0%, #1a3a8a 60%, #1e40af 100%)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
            }}
        >
            {/* Logo */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
                    }}>
                        <GraduationCap size={20} color="white" />
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, color: 'white', fontSize: '15px', lineHeight: 1 }}>EduERP</p>
                        <p style={{ color: '#93c5fd', fontSize: '11px', marginTop: '3px' }}>Finance Module</p>
                    </div>
                </div>
            </div>

            {/* Nav section label */}
            <div style={{ padding: '20px 20px 8px' }}>
                <p style={{ color: '#64a3d9', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Finance
                </p>
            </div>

            {/* Nav Items */}
            <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                {navItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'white' : '#bfdbfe',
                            background: isActive ? 'rgba(59,130,246,0.35)' : 'transparent',
                            border: isActive ? '1px solid rgba(96,165,250,0.3)' : '1px solid transparent',
                            textDecoration: 'none',
                            boxShadow: isActive ? '0 2px 8px rgba(59,130,246,0.2)' : 'none',
                        })}
                    >
                        <Icon size={17} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User / Logout */}
            <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', marginBottom: '8px', background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: 'white', flexShrink: 0 }}>A</div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Amaljith UK</p>
                        <p style={{ color: '#93c5fd', fontSize: '11px' }}>Finance Admin</p>
                    </div>
                </div>
                <button
                    onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                        padding: '9px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: 'transparent', color: '#93c5fd', fontSize: '13px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#93c5fd'; }}
                >
                    <LogOut size={15} />
                    Sign out
                </button>
            </div>
        </aside>
    );
}
