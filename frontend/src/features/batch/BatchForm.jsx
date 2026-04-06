import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, CalendarDays, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const BatchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    batchName: "", course: "", academicYear: "",
    startDate: "", endDate: "", 
    maxStudents: "", classTiming: "", status: "active"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Batch cohort created successfully.");
    navigate("/batches");
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/batches")}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create New Batch</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Configure cohort capacity and scheduling.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Batch Identification</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Batch Name" name="batchName" value={formData.batchName} onChange={handleChange} placeholder="e.g. MCA 2024-26 A" required />
            <Input label="Course" name="course" value={formData.course} onChange={handleChange} placeholder="Select Target Course" required />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Scheduling & Timeline</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
            <Input label="Predicted End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
            <Input label="Class Timing" name="classTiming" value={formData.classTiming} onChange={handleChange} placeholder="e.g. 9:00 AM - 1:00 PM (Mon-Fri)" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Capacity Limits</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Maximum Student Capacity" name="maxStudents" type="number" value={formData.maxStudents} onChange={handleChange} placeholder="e.g. 60" required />
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Current Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 transition-all outline-none">
                <option value="active">Active / Disbursing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed / Merged</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 py-4">
          <Button variant="secondary" type="button" onClick={() => navigate("/batches")}>
            Cancel Setup
          </Button>
          <Button type="submit" className="px-10 py-4 shadow-xl shadow-blue-200/50 text-base font-bold bg-blue-600 hover:bg-blue-700">
            Initialize Batch
          </Button>
        </div>
      </form>
    </div>
  );
};
