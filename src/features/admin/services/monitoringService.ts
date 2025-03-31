import apiClient from "src/global/services/ApiClient";

export const monitoringService = {
  async getBasicMetrics() {
    const response = await apiClient.get('/admin/monitoring/metrics');
    return response.data;
  },

  async getSystemInfo() {
    const response = await apiClient.get('/admin/monitoring/system');
    return response.data;
  },

  async getRequestStats(period: string = 'day') {
    const response = await apiClient.get(`/admin/monitoring/requests?period=${period}`);
    return response.data;
  }
};
