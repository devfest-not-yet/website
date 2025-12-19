import apiClient from './client';

export const adminApi = {
    getAnalytics: async () => {
        const response = await apiClient.get('/admin/analytics');
        return response.data;
    },
    getStock: async () => {
        const response = await apiClient.get('/admin/stock');
        return response.data;
    },
    updateStock: async (ingredient_id, available_quantity) => {
        const response = await apiClient.post('/admin/stock', {
            ingredient_id,
            available_quantity
        });
        return response.data;
    },
    getSchedule: async (date, mealType) => {
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (mealType) params.append('meal_type', mealType);

        const response = await apiClient.get(`/admin/schedule?${params}`);
        return response.data;
    },
    triggerAI: async () => {
        const response = await apiClient.post('/ai/process-daily');
        return response.data;
    }
};
