import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Toaster } from "react-hot-toast";

// New Module Placeholders
import { StudentAttendance } from "./features/attendance/StudentAttendance";
import { StaffAttendance } from "./features/attendance/StaffAttendance";
import { StaffList } from "./features/staff/StaffList";
import { FeeStructure } from "./features/finance/FeeStructure";
import { Payments } from "./features/finance/Payments";
import { CommunicationLog } from "./features/communication/CommunicationLog";
import { Reports } from "./features/reports/Reports";
import { InstitutionSettings } from "./features/settings/InstitutionSettings";
import { Users } from "./features/settings/Users";
import { Roles } from "./features/settings/Roles";
import { Permissions } from "./features/settings/Permissions";
import { MergeLog } from "./features/settings/MergeLog";
import { Certificates } from "./features/documents/Certificates";
import { TC } from "./features/documents/TC";


function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* ERP Module Routes */}
          <Route path="students" element={<StudentList />} />
          <Route path="parents" element={<ParentForm />} />
          <Route path="admission" element={<AdmissionForm />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="batches" element={<BatchList />} />
          <Route path="placements" element={<PlacementList />} />

          {/* Attendance Routes */}
          <Route path="attendance">
            <Route path="student" element={<StudentAttendance />} />
            <Route path="staff" element={<StaffAttendance />} />
          </Route>

          {/* Staff Routes */}
          <Route path="staff" element={<StaffList />} />

          {/* Finance Routes */}
          <Route path="finance">
            <Route path="fees" element={<FeeStructure />} />
            <Route path="payments" element={<Payments />} />
          </Route>

          {/* Documents Routes */}
          <Route path="certificates" element={<Certificates />} />
          <Route path="tc" element={<TC />} />

          {/* Core App Routes */}
          <Route path="communication" element={<CommunicationLog />} />
          <Route path="reports" element={<Reports />} />

          {/* Settings Routes */}
          <Route path="settings">
            <Route path="institution" element={<InstitutionSettings />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="permissions" element={<Permissions />} />
          </Route>

          {/* Advanced Routes */}
          <Route path="advanced">
            <Route path="merge-log" element={<MergeLog />} />
          </Route>
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
