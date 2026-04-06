import { useState } from "react";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Award, Briefcase, DollarSign, Edit2, Trash2, LayoutGrid, List, Search, Plus, MapPin, Calendar } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Placement Records View
 * Features a toggle between a management table and a visual Success Gallery.
 */
export const PlacementList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("gallery"); // 'gallery' or 'table'

  const [placements] = useState([
    { id: "PL101", student: "Amal Nath", company: "TCS", role: "Software Engineer", salary: "₹6.5 LPA", date: "2024-03-15", location: "Kochi" },
    { id: "PL102", student: "Riya S", company: "Infosys", role: "UI/UX Designer", salary: "₹5.8 LPA", date: "2024-03-20", location: "Bangalore" },
    { id: "PL103", student: "Kevin V", company: "Amazon", role: "SDE-1", salary: "₹18 LPA", date: "2024-03-25", location: "Hyderabad" },
    { id: "PL104", student: "Sneha Nair", company: "Meta", role: "Product Designer", salary: "₹20 LPA", date: "2024-03-28", location: "London" },
    { id: "PL105", student: "Arjun K", company: "Netflix", role: "Backend Engineer", salary: "₹22 LPA", date: "2024-03-30", location: "California" },
  ]);

  const filteredPlacements = placements.filter(p => 
    p.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: "Student", accessor: "student", render: (p) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
          {p.student[0]}
        </div>
        <span className="font-semibold text-gray-900">{p.student}</span>
      </div>
    )},
    { header: "Company", accessor: "company", render: (p) => (
      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border border-gray-200">
        {p.company}
      </span>
    )},
    { header: "Role", accessor: "role", render: (p) => <span className="text-gray-600 font-medium">{p.role}</span> },
    { header: "Package", accessor: "salary", render: (p) => <span className="text-emerald-600 font-black">{p.salary}</span> },
    { header: "Location", accessor: "location", render: (p) => (
      <div className="flex items-center gap-1 text-gray-400">
        <MapPin size={12} />
        <span className="text-xs">{p.location}</span>
      </div>
    )},
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Placement Records <Award className="text-amber-500" size={32} />
          </h1>
          <p className="text-gray-500 font-medium mt-1">Celebrating our students' professional milestones.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setViewMode("gallery")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${
              viewMode === 'gallery' ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <LayoutGrid size={18} /> Gallery
          </button>
          <button 
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${
              viewMode === 'table' ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <List size={18} /> Table
          </button>
        </div>
      </div>

      {viewMode === "gallery" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlacements.map((p, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {p.student[0]}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.company}</p>
                    <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg mt-1 inline-block">{p.salary}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{p.student}</h3>
                <p className="text-gray-500 font-bold text-sm mt-1 flex items-center gap-1.5 uppercase tracking-wide">
                   <Briefcase size={14} className="text-blue-500" /> {p.role}
                </p>

                <div className="mt-6 pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={14} />
                    <span className="text-xs font-bold">{p.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 justify-end">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">{p.date.split('-')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-8 py-4 rounded-3xl text-lg shadow-xl shadow-blue-200">
              <Plus size={24} /> New Record
            </Button>
          </div>
        </div>
      ) : (
        <Table
          title="Placement List"
          columns={columns}
          data={filteredPlacements}
          onAdd={() => setIsModalOpen(true)}
          onSearch={setSearchQuery}
          actions={() => (
            <div className="flex gap-1">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={16} /></button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
            </div>
          )}
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="New Placement Record"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Student" placeholder="Search student name..." required />
            <Input label="Company" placeholder="e.g. Google, Amazon" required />
            <Input label="Designation" placeholder="e.g. Frontend Associate" required />
            <Input label="Package (Annual)" placeholder="e.g. 12 LPA" />
            <Input label="Location" placeholder="e.g. Bangalore" />
            <Input label="Joining Date" type="date" />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Placement</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
