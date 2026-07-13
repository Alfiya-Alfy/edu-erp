// Redirect to the main CommunicationLogsPage
export { default } from './CommunicationLogsPage';
export const CommunicationLog = () => {
  const CommunicationLogsPage = require('./CommunicationLogsPage').default;
  return <CommunicationLogsPage />;
};
