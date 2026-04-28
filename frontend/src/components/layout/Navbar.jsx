import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const pageMeta = {
    '/finance/payments': { title: 'Payments', sub: 'Track all financial transactions' },
    '/finance/fee-structure': { title: 'Fee Structure', sub: 'Define course-wise fee configurations' },
    '/finance/certificates': { title: 'Certificates', sub: 'Generate and manage student certificates' },
    '/finance/transfer-certificate': { title: 'Transfer Certificate', sub: 'Manage student transfer certificates' },
};

export default function Navbar() {
    const { pathname } = useLocation();
    const meta = pageMeta[pathname] || { title: 'Finance', sub: 'EduERP Finance Module' };

    return (
        <header
            style={{
                position: 'fixed', top: 0, left: '240px', right: 0, height: '64px', zIndex: 30,
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #e8edf5',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 28px',
                boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
            }}
        >
            <div>
                <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{meta.title}</h1>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{meta.sub}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Notification */}
                <button
                    style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                    <Bell size={19} />
                    <span style={{
                        position: 'absolute', top: '7px', right: '7px', width: '8px', height: '8px',
                        background: '#ef4444', borderRadius: '50%', border: '2px solid white',
                    }} />
                </button>

                {/* Divider */}
                <div style={{ width: '1px', height: '28px', background: '#e2e8f0' }} />

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '13px', color: 'white',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
                    }}>A</div>
                    <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Amaljith UK</p>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>Finance Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
