const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// IN-MEMORY STORAGE (Temporary fix so app works without local MongoDB)
let storage = {
  institutions: [
    { _id: '1', institution_name: "Kochi Main Branch", place: "Kochi", status: "active" },
    { _id: '2', institution_name: "Kollam Branch", place: "Kollam", status: "active" }
  ],
  courses: [
    { _id: '1', institution_id: '1', course_name: 'Python Programming', course_code: 'PY101', duration_in_months: 6, total_fees: 20000.00, description: 'Learn Python basics to advanced', syllabus: 'Variables, Loops, Functions, OOP', status: 'active' },
    { _id: '2', institution_id: '2', course_name: 'Java Development', course_code: 'JV101', duration_in_months: 6, total_fees: 25000.00, description: 'Core and Advanced Java concepts', syllabus: 'OOP, JDBC, Spring Basics', status: 'active' },
    { _id: '3', institution_id: '1', course_name: 'Data Science', course_code: 'DS101', duration_in_months: 8, total_fees: 40000.00, description: 'Data analysis and machine learning', syllabus: 'Python, Pandas, ML Models', status: 'active' },
    { _id: '4', institution_id: '2', course_name: 'Web Development', course_code: 'WD101', duration_in_months: 5, total_fees: 18000.00, description: 'Frontend and backend web development', syllabus: 'HTML, CSS, JS, Node.js', status: 'active' },
    { _id: '5', institution_id: '1', course_name: 'Artificial Intelligence', course_code: 'AI101', duration_in_months: 10, total_fees: 50000.00, description: 'AI concepts and real-world applications', syllabus: 'ML, Deep Learning, NLP', status: 'archived' }
  ],
  batches: [
    { _id: '1', course_id: '1', institution_id: '1', batch_name: 'Python Batch A', start_date: '2026-01-01', end_date: '2026-06-30', timing: '10:00 AM - 12:00 PM', max_students: 30, assigned_staff_id: '1', status: 'active' },
    { _id: '2', course_id: '2', institution_id: '2', batch_name: 'Java Batch B', start_date: '2026-01-15', end_date: '2026-07-15', timing: '02:00 PM - 04:00 PM', max_students: 25, assigned_staff_id: '2', status: 'active' },
    { _id: '3', course_id: '3', institution_id: '1', batch_name: 'Data Science Batch C', start_date: '2026-02-01', end_date: '2026-09-30', timing: '11:00 AM - 01:00 PM', max_students: 20, assigned_staff_id: '3', status: 'active' },
    { _id: '4', course_id: '4', institution_id: '2', batch_name: 'Web Dev Batch D', start_date: '2026-02-10', end_date: '2026-07-10', timing: '03:00 PM - 05:00 PM', max_students: 30, assigned_staff_id: '4', status: 'inactive' },
    { _id: '5', course_id: '5', institution_id: '1', batch_name: 'AI Batch E', start_date: '2026-03-01', end_date: '2026-12-31', timing: '09:00 AM - 11:00 AM', max_students: 15, assigned_staff_id: '5', status: 'completed' }
  ],
  students: [
    { _id: '1', institution_id: '1', course_id: '1', batch_id: '1', student_name: 'Rahul Kumar', first_name: 'Rahul', last_name: 'Kumar', gender: 'Male', date_of_birth: '2000-05-10', email: 'rahul@gmail.com', phone_number: '9000000001', address: 'MG Road', city: 'Kochi', state: 'Kerala', pincode: '682001', blood_group: 'O+', graduation_status: 'Yes', status: 'active' },
    { _id: '2', institution_id: '2', course_id: '2', batch_id: '2', student_name: 'Anjali Nair', first_name: 'Anjali', last_name: 'Nair', gender: 'Female', date_of_birth: '2001-08-15', email: 'anjali@gmail.com', phone_number: '9000000002', address: 'Chinnakada', city: 'Kollam', state: 'Kerala', pincode: '691001', blood_group: 'A+', graduation_status: 'Pursuing', status: 'active' },
    { _id: '3', institution_id: '1', course_id: '3', batch_id: '3', student_name: 'Arjun Menon', first_name: 'Arjun', last_name: 'Menon', gender: 'Male', date_of_birth: '1999-12-20', email: 'arjun@gmail.com', phone_number: '9000000003', address: 'Kaloor', city: 'Kochi', state: 'Kerala', pincode: '682017', blood_group: 'B+', graduation_status: 'Yes', status: 'active' },
    { _id: '4', institution_id: '2', course_id: '4', batch_id: '4', student_name: 'Meera Das', first_name: 'Meera', last_name: 'Das', gender: 'Female', date_of_birth: '2002-03-25', email: 'meera@gmail.com', phone_number: '9000000004', address: 'Karunagappally', city: 'Kollam', state: 'Kerala', pincode: '690518', blood_group: 'O-', graduation_status: 'No', status: 'active' },
    { _id: '5', institution_id: '1', course_id: '5', batch_id: '5', student_name: 'Kiran Pillai', first_name: 'Kiran', last_name: 'Pillai', gender: 'Male', date_of_birth: '2001-07-12', email: 'kiran@gmail.com', phone_number: '9000000005', address: 'Vyttila', city: 'Kochi', state: 'Kerala', pincode: '682019', blood_group: 'AB+', graduation_status: 'Pursuing', status: 'active' }
  ],
  users: [
    { _id: '1', user_name: 'ramesh_k' },
    { _id: '2', user_name: 'suresh_n' },
    { _id: '3', user_name: 'anita_j' },
    { _id: '4', user_name: 'rahul_m' },
    { _id: '5', user_name: 'divya_p' }
  ],
  staff: [
    { _id: '1', user_id: '1', institution_id: '1', staff_name: 'Dr. Sarah Wilson', designation: 'Senior Professor', contract_end_date: '2027-03-31', experience_years: 12, qualification: 'PhD Computer Science', status: 'active', email: 'sarah.wilson@school.edu', department: 'Computer Science' },
    { _id: '2', user_id: '2', institution_id: '2', staff_name: 'John Miller', designation: 'Assistant Trainer', contract_end_date: '2027-06-30', experience_years: 4, qualification: 'M.Tech', status: 'active', email: 'john.miller@school.edu', department: 'Information Technology' },
    { _id: '3', user_id: '3', institution_id: '1', staff_name: 'Anita Joseph', designation: 'HR Head', contract_end_date: '2026-12-31', experience_years: 8, qualification: 'MBA HR', status: 'active', email: 'anita.j@school.edu', department: 'Human Resources' },
    { _id: '4', user_id: '4', institution_id: '2', staff_name: 'Robert Brown', designation: 'Accounts Manager', contract_end_date: '2027-01-15', experience_years: 6, qualification: 'CPA', status: 'active', email: 'robert.b@school.edu', department: 'Finance' },
    { _id: '5', user_id: '5', institution_id: '1', staff_name: 'Michael Davis', designation: 'Lab assistant', contract_end_date: '2026-11-30', experience_years: 3, qualification: 'B.Sc Physics', status: 'active', email: 'michael.d@school.edu', department: 'Science' }
  ],
  attendance_students: [
    { _id: '1', student_id: '1', student_name: 'Rahul Kumar', batch_id: '1', institution_id: '1', attendance_date: '2026-04-14', status: 'Present', marked_by: '1', remarks: 'On time' },
    { _id: '2', student_id: '2', student_name: 'Anjali Nair', batch_id: '2', institution_id: '2', attendance_date: '2026-04-14', status: 'Absent', marked_by: '1', remarks: 'Sick leave' }
  ],
  attendance_teachers: [
    { _id: '1', staff_id: '1', staff_name: 'Dr. Sarah Wilson', institution_id: '1', attendance_date: '2026-04-14', status: 'Present', marked_by: 'admin', remarks: 'Regular' },
    { _id: '2', staff_id: '2', staff_name: 'John Miller', institution_id: '2', attendance_date: '2026-04-14', status: 'Present', marked_by: 'admin', remarks: 'Regular' },
    { _id: '3', staff_id: '3', staff_name: 'Anita Joseph', institution_id: '1', attendance_date: '2026-04-14', status: 'Absent', marked_by: 'admin', remarks: 'Holiday' }
  ],
  comms_logs: [
    { _id: '1', student_id: '1', staff_id: '1', parent_id: '1', institution_id: '1', communication_message: 'Your ward Rahul Kumar attended all classes today.', type: 'sms', subject: 'Daily Attendance Report', delivery_status: 'delivered', sent_at: '2026-04-14', recipient: 'Rahul Kumar (Parent)', sent_by: 'System' },
    { _id: '2', student_id: '2', staff_id: '2', parent_id: '2', institution_id: '2', communication_message: 'Fee payment of $500 is due for April.', type: 'email', subject: 'Payment Reminder', delivery_status: 'sent', sent_at: '2026-04-14', recipient: 'Anjali Nair (Parent)', sent_by: 'Finance Dept' },
    { _id: '3', student_id: '3', staff_id: '1', parent_id: '3', institution_id: '1', communication_message: 'Midterm exam starts next Monday.', type: 'sms', subject: 'Exam Alert', delivery_status: 'failed', sent_at: '2026-04-13', recipient: 'Arjun Menon (Parent)', sent_by: 'Admin' }
  ],
  payments: [],
  certificates: [],
  tc: [],
  placement_records: [],
  fee_structure: []
};


console.warn("⚠️  RUNNING WITH IN-MEMORY STORAGE. Data will be lost on server restart.");

// Generic CRUD helper for Memory Storage
const createRoutes = (modelKey, path) => {
  app.get(path, (req, res) => {
    let results = storage[modelKey];
    // Basic filtering for attendance
    if (req.query.batch_id) results = results.filter(i => i.batch_id === req.query.batch_id);
    if (req.query.date) results = results.filter(i => i.attendance_date === req.query.date);
    res.json(results);
  });

  app.post(path, (req, res) => {
    const newItem = { ...req.body, _id: Date.now().toString() };
    storage[modelKey].push(newItem);
    res.json(newItem);
  });

  app.put(`${path}/:id`, (req, res) => {
    const index = storage[modelKey].findIndex(i => i._id === req.params.id);
    if (index !== -1) {
      storage[modelKey][index] = { ...req.body, _id: req.params.id };
      res.json(storage[modelKey][index]);
    } else res.status(404).json({ error: "Not found" });
  });

  app.delete(`${path}/:id`, (req, res) => {
    storage[modelKey] = storage[modelKey].filter(i => i._id !== req.params.id);
    res.json({ message: 'Deleted' });
  });
};

createRoutes('attendance_students', '/api/attendance/students');
createRoutes('attendance_teachers', '/api/attendance/teachers');
createRoutes('students', '/api/students');
createRoutes('staff', '/api/staff');
createRoutes('staff', '/api/teachers'); // Aliasing teachers to staff
createRoutes('courses', '/api/courses');
createRoutes('batches', '/api/batches');
createRoutes('institutions', '/api/institutions');
createRoutes('comms_logs', '/api/comms-logs');
createRoutes('payments', '/api/payments');
createRoutes('certificates', '/api/certificates');
createRoutes('tc', '/api/tc');
createRoutes('placement_records', '/api/placement');
createRoutes('fee_structure', '/api/fee-structure');
createRoutes('users', '/api/users');






// (Keep mongoose.connect commented optionally or logic for later)
// mongoose.connect(...)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (MEMORY MODE)`);
});

