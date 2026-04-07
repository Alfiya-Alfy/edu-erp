import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Payments from './pages/finance/Payments';
import FeeStructure from './pages/finance/FeeStructure';
import Certificates from './pages/finance/Certificates';
import TransferCertificate from './pages/finance/TransferCertificate';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '10px', fontSize: '14px' },
          success: { iconTheme: { primary: '#1d4ed8', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Redirect root to finance */}
        <Route path="/" element={<Navigate to="/finance/payments" replace />} />

        {/* Finance Module */}
        <Route
          path="/finance/payments"
          element={<Layout><Payments /></Layout>}
        />
        <Route
          path="/finance/fee-structure"
          element={<Layout><FeeStructure /></Layout>}
        />
        <Route
          path="/finance/certificates"
          element={<Layout><Certificates /></Layout>}
        />
        <Route
          path="/finance/transfer-certificate"
          element={<Layout><TransferCertificate /></Layout>}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/finance/payments" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
