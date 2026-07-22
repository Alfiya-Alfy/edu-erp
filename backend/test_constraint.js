const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgresql://postgres.ahvhbkioncgrfklwpqos:Ke1sbKTNOhYPDrdr@aws-1-ap-south-1.pooler.supabase.com:6543/postgres', {
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});
sequelize.query("SELECT conname, pg_get_constraintdef(c.oid) AS constraint_def FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace WHERE c.conrelid = 'students'::regclass")
  .then(res => { console.log(res[0]); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
