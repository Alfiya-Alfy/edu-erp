import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Briefcase, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const PlacementForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student: "", company: "", role: "",
    salary: "", location: "", joiningDate: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Placement record created successfully!");
    navigate("/placements");
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/placements")}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
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

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Student & Target</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Student (Search ID/Name)" name="student" value={formData.student} onChange={handleChange} placeholder="Search student..." required />
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
          <Button variant="secondary" type="button" onClick={() => navigate("/placements")}>
            Cancel
          </Button>
          <Button type="submit" className="px-10 py-4 shadow-xl shadow-blue-200/50 text-base font-bold bg-blue-600 hover:bg-blue-700">
            Save Placement Record
          </Button>
        </div>
      </form>
    </div>
  );
};
