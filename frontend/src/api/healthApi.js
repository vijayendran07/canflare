import axiosInstance from './axiosInstance';

/**
 * Health Check API service
 */
export const healthApi = {
  getHealth: async () => {
    return await axiosInstance.get('/health');
  },
};

export default healthApi;

