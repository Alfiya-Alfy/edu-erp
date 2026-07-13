// Redirect to the main AttendancePage
export { default } from './AttendancePage';
export const StaffAttendance = () => {
  const AttendancePage = require('./AttendancePage').default;
  return <AttendancePage defaultType="staff" />;
};
