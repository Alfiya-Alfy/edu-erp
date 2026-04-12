import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Students from './views/Students';
import Staff from './views/Staff';
import Courses from './views/Courses';
import Attendance from './views/Attendance';
import Payments from './views/Payments';
import Communication from './views/Communication';
import Certificates from './views/Certificates';
import Reports from './views/Reports';
import Settings from './views/Settings';
import Analysis from './views/Analysis';
import Login from './views/Login';
import Signup from './views/Signup';

// ALFIYA's New Modules
import Users from './views/Users';
import Roles from './views/Roles';
import Institutions from './views/Institutions';
import InstitutionMergeLog from './views/InstitutionMergeLog';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="staff" element={<Staff />} />
            <Route path="courses" element={<Courses />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payments" element={<Payments />} />
            <Route path="communication" element={<Communication />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analysis" element={<Analysis />} />
            
            {/* ALFIYA's Routes */}
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="institutions" element={<Institutions />} />
            <Route path="merge-log" element={<InstitutionMergeLog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
