import { useState, useEffect } from "react";
import { Table } from "../../components/ui/Table";
import { Award, Briefcase, Edit2, Trash2, LayoutGrid, List, MapPin, Calendar, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabase";

/**
 * Placement Records View
 * Features a toggle between a management table and a visual Success Gallery.
 */
export const PlacementList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("gallery"); // 'gallery' or 'table'

  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacements();
  }, []);

  async function fetchPlacements() {
    try {
      setLoading(true);
      // Joining with students table to get student_name
      const { data, error } = await supabase
        .from('placement_records')
        .select('*, students(student_name)')
        .order('placement_date', { ascending: false });
        
      if (error) throw error;
      setPlacements(data || []);
    } catch (err) {
      console.error("Supabase Error:", err.message);
      toast.error("Error fetching placement_records");
    } finally {
      setLoading(false);
    }
  }

  const filteredPlacements = placements.filter(p => 
    (p.students?.student_name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.company_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: "Student", accessor: "students.student_name", render: (p) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
          {(p.students?.student_name || "?")[0]}
        </div>
        <span className="font-semibold text-gray-900">{p.students?.student_name || p.student_id}</span>
      </div>
    )},
    { header: "Company", accessor: "company_name", render: (p) => (
      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border border-gray-200">
        {p.company_name}
      </span>
    )},
    { header: "Role", accessor: "job_role", render: (p) => <span className="text-gray-600 font-medium">{p.job_role}</span> },
    { header: "Package", accessor: "salary_package", render: (p) => <span className="text-emerald-600 font-black">{p.salary_package}</span> },
    { header: "Location", accessor: "placement_location", render: (p) => (
      <div className="flex items-center gap-1 text-gray-400">
        <MapPin size={12} />
        <span className="text-xs">{p.placement_location}</span>
      </div>
    )},
  ];

  if (loading && placements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold">Loading placement gallery...</p>
      </div>
    );
  }

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
                    {(p.students?.student_name || "?")[0]}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.company_name}</p>
                    <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg mt-1 inline-block">{p.salary_package}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{p.students?.student_name || "Unknown Student"}</h3>
                <p className="text-gray-500 font-bold text-sm mt-1 flex items-center gap-1.5 uppercase tracking-wide">
                   <Briefcase size={14} className="text-blue-500" /> {p.job_role}
                </p>

                <div className="mt-6 pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={14} />
                    <span className="text-xs font-bold">{p.placement_location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 justify-end">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">{p.placement_date ? p.placement_date.split('-')[0] : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => navigate("/placements/new")} 
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-3xl text-lg font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
            >
               New Record
            </button>
          </div>
        </div>
      ) : (
        <Table
          title="Placement List"
          columns={columns}
          data={filteredPlacements}
          onAdd={() => navigate("/placements/new")}
          onSearch={setSearchQuery}
          actions={() => (
            <div className="flex gap-1">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={16} /></button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
            </div>
          )}
        />
      )}
    </div>
  );
};

