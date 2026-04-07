import React, { useState, useEffect } from "react";
import { createApi } from "../../api/genericApi";
import { getCourses, getBatches, getInstitutions } from "../attendance/attendanceApi";

const studentApi = createApi("students");

const StudentForm = ({ close, refresh, editData }) => {
  const [formData, setFormData] = useState({
    name: "",
    student_name: "",
    email: "",
    student_id: "",
    institution_id: "",
    course_id: "",
    batch_id: "",
    course: "",
    batch: "",
    phone: "",
  });

  const [metadata, setMetadata] = useState({
    institutions: [],
    courses: [],
    batches: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMetadata = async () => {
        try {
            const [inst, cour, bat] = await Promise.all([
                getInstitutions(),
                getCourses(),
                getBatches()
            ]);
            setMetadata({ institutions: inst, courses: cour, batches: bat });
            
            if (editData) {
                setFormData(editData);
            } else {
                setFormData(prev => ({
                    ...prev,
                    institution_id: inst[0]?._id || "",
                    course_id: cour[0]?._id || "",
                    batch_id: bat[0]?._id || "",
                }));
            }
        } catch (err) {
            console.error("Failed to load metadata:", err);
        }
    };
    loadMetadata();
  }, [editData]);

  const filteredBatches = metadata.batches.filter(b => b.course_id === formData.course_id && b.institution_id === formData.institution_id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Sync names for compatibility
    const courseObj = metadata.courses.find(c => c._id === formData.course_id);
    const batchObj = metadata.batches.find(b => b._id === formData.batch_id);
    
    const finalData = {
        ...formData,
        student_name: formData.name,
        course: courseObj ? courseObj.course_name : formData.course,
        batch: batchObj ? batchObj.batch_name : formData.batch,
    };

    try {
      if (editData) await studentApi.update(editData._id, finalData);
      else await studentApi.create(finalData);
      refresh();
      close();
    } catch (e) { 
      console.error(e); 
      alert(`Save failed!`); 
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
            <h2>{editData ? "Edit Student" : "Register Student"}</h2>
            <p>Fill in academic and contact details.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid-form">
          <div className="form-group full">
            <label>Full Name</label>
            <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rahul Sharma" />
          </div>
          
          <div className="form-group">
            <label>Institution</label>
            <select
                required
                value={formData.institution_id}
                onChange={(e) => setFormData({ ...formData, institution_id: e.target.value })}
            >
                {metadata.institutions.map(i => <option key={i._id} value={i._id}>{i.institution_name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Student ID (Numeric)</label>
            <input required value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} placeholder="1001" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="rahul@example.com" />
          </div>

          <div className="form-group">
            <label>Course</label>
            <select 
                value={formData.course_id} 
                onChange={(e) => setFormData({...formData, course_id: e.target.value})}
            >
                {metadata.courses.map(c => <option key={c._id} value={c._id}>{c.course_name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Batch</label>
            <select 
                value={formData.batch_id} 
                onChange={(e) => setFormData({...formData, batch_id: e.target.value})}
            >
                {filteredBatches.map(b => <option key={b._id} value={b._id}>{b.batch_name}</option>)}
            </select>
          </div>

          <div className="form-group full">
            <label>Phone Number</label>
            <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 9876543210" />
          </div>

          <div className="form-actions full">
            <button type="button" onClick={close} className="cancel-btn">Discard</button>
            <button type="submit" disabled={loading} className="submit-btn">{loading ? "Saving..." : "Save Student"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;

