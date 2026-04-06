import { useState } from "react";
import { Table } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Layers, Calendar, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * Batch Management View
 * Handles Year-wise and Course-wise Batches.
 */
export const BatchList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [batches] = useState([
    { id: "B2023-01", name: "BCA 2023-26 A", course: "BCA", capacity: 45, filled: 42, status: "Active" },
    { id: "B2024-01", name: "MCA 2024-26 A", course: "MCA", capacity: 30, filled: 28, status: "Active" },
    { id: "B2022-01", name: "B.Tech 2022-26 A", course: "B.Tech", capacity: 60, filled: 58, status: "Active" },
    { id: "B2023-02", name: "BCA 2023-26 B", course: "BCA", capacity: 45, filled: 40, status: "Active" },
    { id: "B2024-02", name: "DM 2024 Short-term", course: "DM", capacity: 20, filled: 15, status: "Ongoing" },
  ]);

  const columns = [
    { header: "Batch Name", accessor: "name", render: (b) => (
      <div className="flex items-center gap-3 font-medium text-gray-900">
        <Layers size={18} className="text-secondary" />
        {b.name}
      </div>
    )},
    { header: "Course", accessor: "course" },
    { header: "Academic Year", accessor: "academicYear", render: (b) => (
      <div className="flex items-center gap-2 text-gray-600">
        <Calendar size={14} />
        {b.academicYear}
      </div>
    )},
    { header: "Student Strength", accessor: "strength" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Batch Management</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Monitor academic cohorts, capacity, and schedules.</p>
        </div>
      </div>

      <Table
        title="Batches"
        columns={columns}
        data={batches.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        onAdd={() => navigate("/batches/new")}
        onSearch={setSearchQuery}
      />
    </div>
  );
};
