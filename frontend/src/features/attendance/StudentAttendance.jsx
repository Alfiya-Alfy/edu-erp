// Redirect to the main AttendancePage (student mode is default)
export { default } from './AttendancePage';
export const StudentAttendance = () => {
  const AttendancePage = require('./AttendancePage').default;
  return <AttendancePage />;
};
