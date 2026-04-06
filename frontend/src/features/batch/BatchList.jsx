import { useState } from "react";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Layers, Calendar, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Batch Management View
 * Handles Year-wise and Course-wise Batches.
 */
export const BatchList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        onAdd={() => setIsModalOpen(true)}
        onSearch={setSearchQuery}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Cohort"
        size="lg"
      >
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input label="Batch Name" placeholder="e.g. MCA 2024-26 A" required />
            <Input label="Course" placeholder="Select Course..." required />
            <Input label="Start Date" type="date" required />
            <Input label="End Date" type="date" />
            <Input label="Max Students" type="number" placeholder="e.g. 45" />
            
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Status</label>
              <select className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 transition-all outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Input label="Class Timing" placeholder="e.g. 9:00 AM - 1:00 PM (Mon-Fri)" />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button type="submit" className="px-8 shadow-xl shadow-blue-200">
              Create Batch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
