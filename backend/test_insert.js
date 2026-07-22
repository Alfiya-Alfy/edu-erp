const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = new Sequelize('postgresql://postgres.ahvhbkioncgrfklwpqos:Ke1sbKTNOhYPDrdr@aws-1-ap-south-1.pooler.supabase.com:6543/postgres', {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function test() {
  try {
    const data = {
      student_name: 'Test Student', 
      institution_id: 1, 
      batch_id: '', 
      course_id: '', 
      email: 'test@example.com', 
      phone_number: '9876543210', 
      dob: '2000-01-01', 
      gender: 'Male', 
      address: '123 Test St', 
      first_name: 'Test', 
      last_name: 'Student', 
      city: 'Test City', 
      state: 'Test State', 
      pincode: 123456, 
      blood_group: 'O+', 
      graduation_status: 'Pursuing', 
      status: 'active'
    };
    
    await sequelize.query(
      `INSERT INTO students (
        student_name, institution_id, batch_id, course_id, email, phone_number, dob, gender, address, 
        first_name, last_name, city, state, pincode, blood_group, graduation_status, status
       )
       VALUES (
        :student_name, :institution_id, :batch_id, :course_id, :email, :phone_number, :dob, :gender, :address, 
        :first_name, :last_name, :city, :state, :pincode, :blood_group, :graduation_status, :status
       ) RETURNING *`,
      { replacements: data, type: QueryTypes.INSERT }
    );
    console.log('Success!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}
test();
