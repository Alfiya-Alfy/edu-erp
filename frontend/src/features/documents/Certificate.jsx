// Redirect to the real Certificates feature
export { default } from '../finance/Certificates';
export const Certificate = () => {
  const Certificates = require('../finance/Certificates').default;
  return <Certificates />;
};
