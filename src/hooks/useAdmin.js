import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';

export const useAnalytics = () => {
    return useQuery({
        queryKey: ['admin-analytics'],
        queryFn: adminApi.getAnalytics,
        refetchInterval: 30000,
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

export const useSchedule = () => {
    return useQuery({
        queryKey: ['admin-schedule'],
        queryFn: adminApi.getSchedule,
    });
};

export const useMenu = () => {
    return useQuery({
        queryKey: ['admin-menu'],
        queryFn: adminApi.getMenu,
    });
};

export const useDistributionTimeslots = () => {
    return useQuery({
        queryKey: ['admin-distribution'],
        queryFn: adminApi.getDistributionTimeslots,
    });
};

export const useStudentDemands = () => {
    return useQuery({
        queryKey: ['admin-students'],
        queryFn: adminApi.getStudentDemands,
    });
};
