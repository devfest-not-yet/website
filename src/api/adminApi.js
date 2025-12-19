import apiClient from './client';

export const adminApi = {
    // Analytics
    getAnalytics: async () => {
        const response = await apiClient.get('admin/analytics');
        return response.data;
    },

    // Stock
    getStock: async () => {
        const response = await apiClient.get('admin/stock/list');
        return response.data;
    },
    updateStock: async (ingredient_id, available_quantity) => {
        const response = await apiClient.post('admin/stock/update', {
            ingredient_id,
            available_quantity
        });
        return response.data;
    },

    // Schedule
    getSchedule: async () => {
        const response = await apiClient.get('admin/schedule/today');
        return response.data;
    },

    // Menu
    getMenu: async () => {
        const response = await apiClient.get('admin/menu/today');
        return response.data;
    },
    triggerAI: async () => {
        const response = await apiClient.post('ai/process-daily');
        return response.data;
    },

    // Distribution
    getDistributionTimeslots: async () => {
        const response = await apiClient.get('admin/distribution/timeslots');
        return response.data;
    },

    // Students
    getStudentDemands: async () => {
        const response = await apiClient.get('admin/students-with-assignments');
        return response.data;
    }
};
