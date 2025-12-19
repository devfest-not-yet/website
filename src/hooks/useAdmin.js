import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';

export const useAnalytics = () => {
    return useQuery({
        queryKey: ['admin-analytics'],
        queryFn: adminApi.getAnalytics,
        refetchInterval: 30000, // Refresh every 30 seconds
    });
};

export const useStock = () => {
    return useQuery({
        queryKey: ['admin-stock'],
        queryFn: adminApi.getStock,
    });
};

export const useUpdateStock = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ingredient_id, quantity }) =>
            adminApi.updateStock(ingredient_id, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-stock'] });
        },
    });
};

export const useSchedule = (date, mealType) => {
    return useQuery({
        queryKey: ['admin-schedule', date, mealType],
        queryFn: () => adminApi.getSchedule(date, mealType),
    });
};
