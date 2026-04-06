import { useState } from "react";
import { Table } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Edit2, Trash2, Eye, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * Student Management View
 * Handles Student List, Add/Edit Modal, and Search filtering.
 */
export const StudentList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock Data for the Academic Module build
  const [students, setStudents] = useState([
    { id: "S1001", name: "Amal Nath", email: "amal@gmail.com", course: "BCA", batch: "2023-26", status: "Active" },
    { id: "S1002", name: "Riya S", email: "riya@hotmail.com", course: "MCA", batch: "2024-26", status: "Active" },
    { id: "S1003", name: "Kevin V", email: "kevin@gmail.com", course: "B.Tech", batch: "2022-26", status: "On-Hold" },
    { id: "S1004", name: "Sneha Nair", email: "sneha@outlook.com", course: "BCA", batch: "2023-26", status: "Active" },
    { id: "S1005", name: "Arjun K", email: "arjun@gmail.com", course: "MCA", batch: "2024-26", status: "Active" },
  ]);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name", render: (s) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
          {s.name[0]}
        </div>
        <span className="font-medium text-gray-900">{s.name}</span>
      </div>
    )},
    { header: "Email", accessor: "email" },
    { header: "Course", accessor: "course" },
    { header: "Batch", accessor: "batch" },
    { header: "Status", accessor: "status", render: (s) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
        s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {s.status}
      </span>
    )},
  ];

  const actions = (s) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => navigate(`/students/${s.id}`)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Eye size={18} />
      </button>
      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 size={18} /></button>
      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDelete(s.id)}><Trash2 size={18} /></button>
    </div>
  );

  const handleDelete = (id) => {
    toast.success("Student record scheduled for deletion");
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    toast.success("Student added successfully (Mock)");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Student Directory</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Manage and track student records across all batches.</p>
        </div>
      </div>

      <Table
        title="Students"
        columns={columns}
        data={students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        onAdd={() => navigate("/students/new")}
        onSearch={setSearchQuery}
        actions={actions}
        pagination={{ current: 1, total: 1 }}
      />
    </div>
  );
};
