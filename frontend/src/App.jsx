import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Toaster } from "react-hot-toast";

// Feature Imports
import { StudentList } from "./features/students/StudentList";
import { ParentForm } from "./features/parents/ParentForm";
import { AdmissionForm } from "./features/admission/AdmissionForm";
import { CourseList } from "./features/courses/CourseList";
import { BatchList } from "./features/batches/BatchList";
import { PlacementList } from "./features/placements/PlacementList";
import { Dashboard } from "./features/dashboard/Dashboard";


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
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
