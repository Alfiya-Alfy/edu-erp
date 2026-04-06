import { useState } from "react";
import { Table } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Book, Clock, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * Course Management View
 * Handles Course Definitions, Duration, and Basic Info.
 */
export const CourseList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [courses] = useState([
    { id: "C101", name: "Bachelor of Computer Applications", code: "BCA", duration: "36 Months", fees: "₹1,50,000", status: "Active" },
    { id: "C102", name: "Master of Computer Applications", code: "MCA", duration: "24 Months", fees: "₹2,00,000", status: "Active" },
    { id: "C103", name: "B.Tech Computer Science", code: "B.Tech", duration: "48 Months", fees: "₹4,50,000", status: "Active" },
    { id: "C104", name: "Digital Marketing", code: "DM", duration: "6 Months", fees: "₹45,000", status: "Active" },
    { id: "C105", name: "UI/UX Design", code: "UIUX", duration: "12 Months", fees: "₹85,000", status: "Active" },
  ]);

  const columns = [
    { header: "Course ID", accessor: "id" },
    { header: "Name", accessor: "name", render: (c) => (
      <div className="flex items-center gap-3 font-medium text-gray-900">
        <Book size={18} className="text-blue-500" />
        {c.name}
      </div>
    )},
    { header: "Duration", accessor: "duration", render: (c) => (
      <div className="flex items-center gap-2 text-gray-600">
        <Clock size={14} />
        {c.duration}
      </div>
    )},
    { header: "Type", accessor: "type" },
    { header: "Status", accessor: "status", render: (c) => (
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">{c.status}</span>
    )},
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Course Directory</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Manage programs, curriculum, and academic offerings.</p>
        </div>
      </div>

      <Table
        title="Courses"
        columns={columns}
        data={courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        onAdd={() => navigate("/courses/new")}
        onSearch={setSearchQuery}
      />
    </div>
  );
};
