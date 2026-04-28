import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, GraduationCap, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../api/supabase";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const StudentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", dob: "", gender: "",
    address: "", city: "", state: "", pincode: "",
    course: "", batch: "", admissionDate: "", bloodGroup: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: courseData } = await supabase.from('course').select('course_id, course_name');
        const { data: batchData } = await supabase.from('batch').select('batch_id, batch_name');
        setCourses(courseData || []);
        setBatches(batchData || []);
      } catch (err) {
        console.error("Error fetching dependencies:", err);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course || !formData.batch) {
      toast.error("Please select a Course and Batch");
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        student_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone_number: formData.phone,
        date_of_birth: formData.dob,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        course_id: parseInt(formData.course),
        batch_id: parseInt(formData.batch),
        blood_group: formData.bloodGroup,
        institution_id: 1, 
        status: 'Active'
      };

      const { data, error } = await supabase
        .from('students')
        .insert([payload]);

      if (error) throw error;

      toast.success("Student registration completed successfully.");
      navigate("/students");
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error("Failed to register: " + (err.message || "Database error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate("/students")}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Register Student</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Fill in the comprehensive details to onboard a new student.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-10">
        
        {/* Basic Information Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. John" required />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" required />
            <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 transition-all outline-none text-gray-900 font-medium">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input label="Email address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required />
            <Input label="Phone Number" name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
            <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" />
          </div>
        </div>

        {/* Academic Details Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Academic Registration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Course Program</label>
              <select name="course" value={formData.course} onChange={handleChange} className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 transition-all outline-none text-gray-900 font-medium" required>
                <option value="">Select Target Course...</option>
                {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Batch Assignment</label>
              <select name="batch" value={formData.batch} onChange={handleChange} className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 transition-all outline-none text-gray-900 font-medium" required>
                <option value="">Assign to Batch...</option>
                {batches.map(b => <option key={b.batch_id} value={b.batch_id}>{b.batch_name}</option>)}
              </select>
            </div>

            <Input label="Admission Date" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} required />
          </div>
        </div>

        {/* Contact & Address Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Residential Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-3">
              <Input label="Full Address" name="address" value={formData.address} onChange={handleChange} placeholder="House No, Street, Landmark" required />
            </div>
            <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Kochi" required />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Kerala" required />
            <Input label="Pincode/ZIP" name="pincode" type="text" value={formData.pincode} onChange={handleChange} placeholder="e.g. 682001" required />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 py-4">
          <Button variant="secondary" type="button" onClick={() => navigate("/students")} disabled={loading}>
            Cancel Registration
          </Button>
          <Button type="submit" disabled={loading} className="px-10 py-4 shadow-xl shadow-blue-200/50 text-base font-bold bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : "Submit & Generate ID"}
          </Button>
        </div>

      </form>
    </div>
  );
};


