import apiClient from './apiClient';

const commsApi = {
  getLogs: () => apiClient.get('/comms-logs'),
  createLog: (data) => apiClient.post('/comms-logs', data),
  getById: (id) => apiClient.get(`/comms-logs/${id}`),
};

export default commsApi;
