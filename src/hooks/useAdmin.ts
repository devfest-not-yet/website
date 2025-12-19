import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import type {
    AnalyticsResponse,
    StockResponse,
    StockUpdateResponseType,
    TodayScheduleResponse,
    MenuResponse,
    TimeslotDistributionResponse,
    StudentsWithAssignmentsResponse,
    AILaunchResponse,
} from "../api/types";

/**
 * React Query Hooks for Admin API
 * 
 * All hooks are fully typed with proper generic parameters.
 */

// ============================================
// Analytics Hooks
// ============================================

export const useAnalytics = (): UseQueryResult<AnalyticsResponse, Error> => {
    return useQuery<AnalyticsResponse, Error>({
        queryKey: ['admin-analytics'],
        queryFn: adminApi.getAnalytics,
        refetchInterval: 30000,
    });
};

// ============================================
// Stock Management Hooks
// ============================================

export const useStock = (): UseQueryResult<StockResponse, Error> => {
    return useQuery<StockResponse, Error>({
        queryKey: ['admin-stock'],
        queryFn: adminApi.getStock,
    });
};

export const useUpdateStock = (): UseMutationResult<
    StockUpdateResponseType,
    Error,
    { ingredient_id: string; quantity: number }
> => {
    const queryClient = useQueryClient();
    return useMutation<
        StockUpdateResponseType,
        Error,
        { ingredient_id: string; quantity: number }
    >({
        mutationFn: ({ ingredient_id, quantity }) =>
            adminApi.updateStock(ingredient_id, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-stock'] });
        },
    });
};

// ============================================
// Schedule & Menu Hooks
// ============================================

export const useSchedule = (): UseQueryResult<TodayScheduleResponse, Error> => {
    return useQuery<TodayScheduleResponse, Error>({
        queryKey: ['admin-schedule'],
        queryFn: adminApi.getTodaySchedule,
    });
};

export const useMenu = (): UseQueryResult<MenuResponse, Error> => {
    return useQuery<MenuResponse, Error>({
        queryKey: ['admin-menu'],
        queryFn: adminApi.getMenu,
    });
};

// ============================================
// Distribution Hooks
// ============================================

export const useDistributionTimeslots = (): UseQueryResult<TimeslotDistributionResponse, Error> => {
    return useQuery<TimeslotDistributionResponse, Error>({
        queryKey: ['admin-distribution'],
        queryFn: () => adminApi.getDistributionTimeslots(),
    });
};

// ============================================
// Student Hooks
// ============================================

export const useStudentDemands = (): UseQueryResult<StudentsWithAssignmentsResponse, Error> => {
    return useQuery<StudentsWithAssignmentsResponse, Error>({
        queryKey: ['admin-students'],
        queryFn: () => adminApi.getStudentDemands(),
    });
};

// ============================================
// AI Processing Hooks
// ============================================

export const useLaunchAI = (): UseMutationResult<AILaunchResponse, Error, void> => {
    const queryClient = useQueryClient();
    return useMutation<AILaunchResponse, Error, void>({
        mutationFn: adminApi.launchAIFlow,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
            queryClient.invalidateQueries({ queryKey: ['admin-students'] });
            queryClient.invalidateQueries({ queryKey: ['admin-distribution'] });
        },
    });
};
