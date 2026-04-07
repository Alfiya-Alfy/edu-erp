import api from './apiClient';

const INST_ID = 1; // TODO: get from auth context

export const getFeeStructures = (params = {}) =>
    api.get('/fee-structure', { params: { institution_id: INST_ID, ...params } });

export const createFeeStructure = (data) =>
    api.post('/fee-structure', { ...data, institution_id: INST_ID });

export const updateFeeStructure = (id, data) =>
    api.put(`/fee-structure/${id}`, data);

export const deleteFeeStructure = (id) =>
    api.delete(`/fee-structure/${id}`);
