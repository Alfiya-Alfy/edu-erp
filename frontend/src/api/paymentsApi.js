import api from './apiClient';

const INST_ID = 1; // TODO: get from auth context

export const getPayments = (params = {}) =>
    api.get('/payments', { params: { institution_id: INST_ID, ...params } });

export const getPaymentById = (id) =>
    api.get(`/payments/${id}`);

export const createPayment = (data) =>
    api.post('/payments', { ...data, institution_id: INST_ID });
