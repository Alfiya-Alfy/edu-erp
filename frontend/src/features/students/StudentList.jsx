import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Eye, Trash2, Mail, Phone, GraduationCap } from "lucide-react";
import { supabase } from "../../api/supabase";
import { Table } from "../../components/ui/Table";
import toast from "react-hot-toast";

/**
 * Student Management View
 * Now connected to Supabase for direct data fetching.
 */
export function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to load students: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = students.filter(student => 
    (student.student_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.student_id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { 
      header: "Student", 
      accessor: "student_name",
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
            {(s.first_name || s.student_name || "?")[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{s.student_name || `${s.first_name} ${s.last_name}`}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.student_id}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Contact", 
      accessor: "email",
      render: (s) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Mail size={12} className="text-gray-400" />
            <span className="text-xs font-medium">{s.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Phone size={12} className="text-gray-400" />
            <span className="text-xs font-medium">{s.phone_number}</span>
          </div>
        </div>
      )
    },
    { 
      header: "Academic", 
      accessor: "course_id",
      render: (s) => (
        <div className="flex items-center gap-2">
          <GraduationCap size={16} className="text-emerald-500" />
          <div>
             <p className="text-sm font-bold text-gray-700">{s.course_id || "Unassigned"}</p>
             <p className="text-[10px] text-gray-400 font-bold uppercase">{s.batch_id || "No Batch"}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (s) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
          s.status === 'Active' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-gray-50 text-gray-500 border-gray-100'
        }`}>
          {s.status || 'Active'}
        </span>
      )
    }
  ];

  if (loading && students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse">Fetching records from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
       <Table
          title="Students"
          data={filteredStudents}
          columns={columns}
          onAdd={() => navigate("/students/new")}
          onSearch={setSearchQuery}
          actions={(s) => (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => navigate(`/students/${s.student_id}`)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="View Profile"
              >
                <Eye size={18} />
              </button>
              <button 
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button 
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
    </div>
  );
}

export default StudentList;

