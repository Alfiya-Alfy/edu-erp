import Sidebar from './Sidebar';
import Navbar from './Navbar';

const SIDEBAR_W = 240;
const NAVBAR_H = 64;

export default function Layout({ children }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            <Sidebar width={SIDEBAR_W} />

            {/* Main area — offset from sidebar */}
            <div style={{ flex: 1, marginLeft: `${SIDEBAR_W}px`, minWidth: 0 }}>
                <Navbar navbarH={NAVBAR_H} sidebarW={SIDEBAR_W} />

                {/* Page content — offset from fixed navbar */}
                <main style={{
                    marginTop: `${NAVBAR_H}px`,
                    padding: '28px 28px 40px',
                    minHeight: `calc(100vh - ${NAVBAR_H}px)`,
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
