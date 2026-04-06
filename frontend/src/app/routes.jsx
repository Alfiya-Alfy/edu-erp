import { Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";

// Feature Imports
import { StudentList } from "../features/students/StudentList";
import { StudentForm } from "../features/students/StudentForm";
import { StudentProfile } from "../features/students/StudentProfile";
import { ParentForm } from "../features/parents/ParentForm";
import { AdmissionForm } from "../features/admission/AdmissionForm";
import { CourseList } from "../features/courses/CourseList";
import { CourseForm } from "../features/courses/CourseForm";
import { BatchList } from "../features/batch/BatchList";
import { BatchForm } from "../features/batch/BatchForm";
import { PlacementList } from "../features/placement/PlacementList";
import { PlacementForm } from "../features/placement/PlacementForm";
import { Dashboard } from "../features/dashboard/Dashboard";

// New Module Placeholders
import { StudentAttendance } from "../features/attendance/StudentAttendance";
import { StaffAttendance } from "../features/attendance/StaffAttendance";
import { StaffList } from "../features/staff/StaffList";
import { StaffForm } from "../features/staff/StaffForm";
import { FeeStructure } from "../features/finance/FeeStructure";
import { Payments } from "../features/finance/Payments";
import { PaymentList } from "../features/finance/PaymentList";
import { PaymentForm } from "../features/finance/PaymentForm";
import { CommunicationLog } from "../features/communication/CommunicationLog";
import { Reports } from "../features/reports/Reports";
import { InstitutionSettings } from "../features/settings/InstitutionSettings";
import { Users } from "../features/settings/Users";
import { Roles } from "../features/settings/Roles";
import { Permissions } from "../features/settings/Permissions";
import { MergeLog } from "../features/settings/MergeLog";
import { Certificate } from "../features/documents/Certificate";
import { TC } from "../features/documents/TC";

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      
      { path: "students", element: <StudentList /> },
      { path: "students/new", element: <StudentForm /> },
      { path: "students/:id", element: <StudentProfile /> },
      
      { path: "parents", element: <ParentForm /> },
      { path: "admission", element: <AdmissionForm /> },
      
      { path: "courses", element: <CourseList /> },
      { path: "courses/new", element: <CourseForm /> },
      
      { path: "batches", element: <BatchList /> },
      { path: "batches/new", element: <BatchForm /> },
      
      { path: "placements", element: <PlacementList /> },
      { path: "placements/new", element: <PlacementForm /> },

      {
        path: "attendance",
        children: [
          { path: "student", element: <StudentAttendance /> },
          { path: "staff", element: <StaffAttendance /> }
        ]
      },

      { path: "staff", element: <StaffList /> },
      { path: "staff/new", element: <StaffForm /> },

      {
        path: "finance",
        children: [
          { path: "fees", element: <FeeStructure /> },
          { path: "payments", element: <Payments /> },
          { path: "history", element: <PaymentList /> },
          { path: "collect", element: <PaymentForm /> }
        ]
      },

      { path: "certificates", element: <Certificate /> },
      { path: "tc", element: <TC /> },

      { path: "communication", element: <CommunicationLog /> },
      { path: "reports", element: <Reports /> },

      {
        path: "settings",
        children: [
          { path: "institution", element: <InstitutionSettings /> },
          { path: "users", element: <Users /> },
          { path: "roles", element: <Roles /> },
          { path: "permissions", element: <Permissions /> }
        ]
      },

      { path: "advanced/merge-log", element: <MergeLog /> }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
];
