import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, MapPin, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const ParentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fatherName: "", fatherPhone: "", fatherOccupation: "",
    motherName: "", motherPhone: "", motherOccupation: "",
    guardianName: "", guardianPhone: "", relationship: "",
    address: "", city: "", state: "", pincode: "",
    linkedStudentId: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Parent details registered successfully.");
    navigate("/parents");
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate("/parents")}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Parent / Guardian Details</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Register parent details and link them to a student.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        
        {/* Linked Student Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-4">
             <div className="flex-1">
               <label className="block text-sm font-semibold text-gray-700 ml-1 mb-2">Link to Student (Search by ID or Name)</label>
               <input 
                 name="linkedStudentId" 
                 value={formData.linkedStudentId} 
                 onChange={handleChange} 
                 placeholder="Search student..." 
                 className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 transition-all outline-none"
               />
             </div>
             <div className="mt-7">
               <Button type="button" variant="secondary" className="px-6 py-3.5">Verify Student</Button>
             </div>
          </div>
        </div>

        {/* Father's Details */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Father's Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Full Name" required />
            <Input label="Phone Number" name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} placeholder="+91 98765 43210" required />
            <Input label="Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} placeholder="e.g. Business" />
          </div>
        </div>

        {/* Mother's Details */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Mother's Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Full Name" required />
            <Input label="Phone Number" name="motherPhone" value={formData.motherPhone} onChange={handleChange} placeholder="+91 98765 43210" required />
            <Input label="Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} placeholder="e.g. Teacher" />
          </div>
        </div>

        {/* Guardian Details (Optional) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Local Guardian Details (Optional)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input label="Guardian's Name" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Full Name" />
            <Input label="Relationship" name="relationship" value={formData.relationship} onChange={handleChange} placeholder="e.g. Uncle" />
            <Input label="Phone Number" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} placeholder="+91 98765 43210" />
          </div>
        </div>

        {/* Primary Contact Address */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Communications Address</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-3">
              <Input label="Full Address" name="address" value={formData.address} onChange={handleChange} placeholder="House No, Street, Landmark" required />
            </div>
            <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Kochi" required />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Kerala" required />
            <Input label="Pincode/ZIP" name="pincode" type="number" value={formData.pincode} onChange={handleChange} placeholder="e.g. 682001" required />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 py-4">
          <Button variant="secondary" type="button" onClick={() => navigate("/parents")}>
            Cancel Registration
          </Button>
          <Button type="submit" className="px-10 py-4 shadow-xl shadow-blue-200/50 text-base font-bold bg-blue-600 hover:bg-blue-700">
            Submit Parent Record
          </Button>
        </div>

      </form>
    </div>
  );
};
