import { useState } from "react";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Book, Clock, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Course Management View
 * Handles Course Definitions, Duration, and Basic Info.
 */
export const CourseList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        onAdd={() => setIsModalOpen(true)}
        onSearch={setSearchQuery}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Course"
        size="lg"
      >
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input label="Course Name" placeholder="e.g. Master of Computer Applications" required />
            <Input label="Course Code" placeholder="e.g. MCA" required />
            <Input label="Duration (Months)" type="number" placeholder="e.g. 24" required />
            <Input label="Total Fees" type="text" placeholder="₹2,00,000" required />
            
            <div className="space-y-2 mb-4 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Course Description</label>
              <textarea 
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 transition-all outline-none h-28 hover:bg-white focus:bg-white"
                placeholder="Enter course overview and learning outcomes..."
              />
            </div>

            <div className="space-y-2 mb-4">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Status</label>
              <select className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 transition-all outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="px-8 shadow-xl shadow-blue-200">
              Save Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
