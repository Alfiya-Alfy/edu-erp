const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

const getStudents = async (req, res) => {
  try {
    const { institution_id } = req.query;
    const parsedId = parseInt(institution_id, 10);
    let query = `
      SELECT s.*, i.institution_name, b.batch_name, c.course_name 
      FROM students s 
      LEFT JOIN institution i ON s.institution_id = i.institution_id
      LEFT JOIN batch b ON s.batch_id = b.batch_id
      LEFT JOIN course c ON s.course_id = c.course_id
    `;
    const replacements = {};
    if (!isNaN(parsedId)) {
      query += ' WHERE s.institution_id = :institution_id';
      replacements.institution_id = parsedId;
    }
    const data = await sequelize.query(query, { 
      replacements,
      type: QueryTypes.SELECT 
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [data] = await sequelize.query(
      `SELECT s.*, i.institution_name, b.batch_name, c.course_name 
       FROM students s 
       LEFT JOIN institution i ON s.institution_id = i.institution_id
       LEFT JOIN batch b ON s.batch_id = b.batch_id
       LEFT JOIN course c ON s.course_id = c.course_id
       WHERE s.student_id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    if (!data) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { 
      student_name, institution_id, batch_id, course_id, email, 
      gender, address, first_name, last_name, city, state, blood_group, 
      graduation_status, status 
    } = req.body;
    const dob = req.body.dob || req.body.date_of_birth;
    
    // Clean phone number (remove non-digits)
    const phone_number_str = req.body.phone_number ? req.body.phone_number.toString().replace(/\D/g, '') : null;
    const phone_number = phone_number_str ? parseInt(phone_number_str, 10) : null;
    
    // Clean integer fields
    const clean_batch_id = batch_id ? parseInt(batch_id, 10) : null;
    const clean_course_id = course_id ? parseInt(course_id, 10) : null;
    const clean_institution_id = institution_id ? parseInt(institution_id, 10) : null;
    const clean_pincode = req.body.pincode ? parseInt(req.body.pincode, 10) : null;
    
    const [result] = await sequelize.query(
      `INSERT INTO students (
        student_name, institution_id, batch_id, course_id, email, phone_number, dob, gender, address, 
        first_name, last_name, city, state, pincode, blood_group, graduation_status, status
       )
       VALUES (
        :student_name, :institution_id, :batch_id, :course_id, :email, :phone_number, :dob, :gender, :address, 
        :first_name, :last_name, :city, :state, :pincode, :blood_group, :graduation_status, :status
       ) RETURNING *`,
      {
        replacements: { 
          student_name: student_name || '', 
          institution_id: clean_institution_id, 
          batch_id: clean_batch_id, 
          course_id: clean_course_id, 
          email: email || null, 
          phone_number: phone_number, 
          dob: dob || null, 
          gender: gender || null, 
          address: address || null, 
          first_name: first_name || null, 
          last_name: last_name || null, 
          city: city || null, 
          state: state || null, 
          pincode: clean_pincode, 
          blood_group: blood_group || null, 
          graduation_status: graduation_status || 'Pursuing', 
          status: status || 'active' 
        },
        type: QueryTypes.INSERT
      }
    );
    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  if (updates.date_of_birth !== undefined) {
    updates.dob = updates.date_of_birth;
    delete updates.date_of_birth;
  }

  // Clean integers and phone number if present
  if (updates.phone_number !== undefined) {
    updates.phone_number = updates.phone_number ? parseInt(updates.phone_number.toString().replace(/\D/g, ''), 10) || null : null;
  }
  if (updates.batch_id !== undefined) updates.batch_id = parseInt(updates.batch_id, 10) || null;
  if (updates.course_id !== undefined) updates.course_id = parseInt(updates.course_id, 10) || null;
  if (updates.institution_id !== undefined) updates.institution_id = parseInt(updates.institution_id, 10) || null;
  if (updates.pincode !== undefined) updates.pincode = parseInt(updates.pincode, 10) || null;
  if (updates.dob === "") updates.dob = null;

  // 1. Remove fields that don't exist in the 'students' table or shouldn't be updated manually
  const allowedFields = [
    'institution_id', 'course_id', 'batch_id', 'student_name', 
    'first_name', 'last_name', 'gender', 'dob', 
    'email', 'phone_number', 'address', 'city', 'state', 
    'pincode', 'blood_group', 'graduation_status', 'status'
  ];

  const filteredUpdates = {};
  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  try {
    const fields = Object.keys(filteredUpdates).map(key => `${key} = :${key}`).join(', ');
    if (!fields) return res.status(400).json({ success: false, message: 'No valid fields provided for update' });

    await sequelize.query(
      `UPDATE students SET ${fields} WHERE student_id = :id`,
      { replacements: { ...filteredUpdates, id }, type: QueryTypes.UPDATE }
    );
    res.json({ success: true, message: 'Student updated successfully in DB' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query(
      'DELETE FROM students WHERE student_id = :id',
      { replacements: { id }, type: QueryTypes.DELETE }
    );
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStudents, getStudentById, createStudent, updateStudent, deleteStudent };
