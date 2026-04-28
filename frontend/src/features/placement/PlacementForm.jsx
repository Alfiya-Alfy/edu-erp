import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Briefcase, MapPin, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../api/supabase";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const PlacementForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const [formData, setFormData] = useState({
    student_id: "", 
    student_name: "", 
    company: "", 
    role: "",
    salary: "", 
    location: "", 
    joiningDate: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simple student search
  const handleStudentSearch = async (val) => {
    setSearchQuery(val);
    if (val.length > 2) {
      const { data } = await supabase
        .from('students')
        .select('student_id, student_name')
        .ilike('student_name', `%${val}%`)
        .limit(5);
      setStudents(data || []);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const selectStudent = (student) => {
    setFormData({ ...formData, student_id: student.student_id, student_name: student.student_name });
    setSearchQuery(student.student_name);
    setShowResults(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_id) {
      toast.error("Please select a valid student from the search.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        student_id: formData.student_id,
        institution_id: 1, // Default
        company_name: formData.company,
        job_role: formData.role,
        salary_package: formData.salary,
        placement_location: formData.location,
        placement_date: formData.joiningDate,
        status: 'Placed'
      };

      const { error } = await supabase
        .from('placement_records')
        .insert([payload]);

      if (error) throw error;

      toast.success("Placement record created successfully!");
      navigate("/placements");
    } catch (err) {
      console.error("Error saving placement:", err);
      toast.error("Failed to save record: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/placements")}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              New Placement Record <Award className="text-amber-500" size={32} />
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Register a corporate milestone for a student.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Student & Target</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 ml-1 mb-2">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 pl-10 transition-all outline-none"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => handleStudentSearch(e.target.value)}
                />
              </div>
              {showResults && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                  {students.length > 0 ? students.map(s => (
                    <button 
                      key={s.student_id}
                      type="button"
                      onClick={() => selectStudent(s)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <p className="font-bold text-gray-900">{s.student_name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.student_id}</p>
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-sm text-gray-500 italic">No students found</div>
                  )}
                </div>
              )}
              {formData.student_id && !showResults && (
                <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1.5 ml-1">
                  Selected: {formData.student_name} ({formData.student_id})
                </p>
              )}
            </div>
            <Input label="Hiring Company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google, Amazon" required />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Offer Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
               <Input label="Designation / Role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Frontend Associate" required />
            </div>
            <Input label="Package (Annual)" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. 12 LPA" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Logistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Location / Branch" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bangalore" />
            <Input label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 py-4">
          <Button variant="secondary" type="button" onClick={() => navigate("/placements")} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="px-10 py-4 shadow-xl shadow-blue-200/50 text-base font-bold bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={20} /> Saving...</> : "Save Placement Record"}
          </Button>
        </div>
      </form>
    </div>
  );
};

