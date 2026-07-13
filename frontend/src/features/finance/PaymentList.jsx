// Redirect to the main Payments page
export { default } from './Payments';
export const PaymentList = () => {
  const Payments = require('./Payments').default;
  return <Payments />;
};
